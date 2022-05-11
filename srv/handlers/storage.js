/* eslint-disable no-console */
const cds = require("@sap/cds");
cds.env.features.fetch_csrf = true;

const eamTemplate = {
	"Planplant": "1701",
	"LocAcc": "000000022307",
	"Equipment": "10000438",
	"Breakdown": false,
	"Plangroup": "001",
	"NotifType": "12",
	"ShortText": "Place your description here",
	"Priotype": "PM",
	"Priority": "4",
	"PmWkctr": "10000430",
	"FunctLoc": "NGPL-F-PT-PV10",
	"Abcindic": "B",
	"Maintplant": "1701",
	"Plsectn": "001",
	"PpWkctr": "10000430",
	"CoArea": "USEA",
	"Costcenter": "OPS-REG-1",
	"CompCode": "USEA",
	"Maintactytype": "250"
};

const ehsTemplate = {
	"IncidentCategory": "001",
	"IncidentTitle": "Sapphire Prep",
	"IncidentUTCDateTime": "/Date(1652306735000+0000)/",
	"IncidentLocationDescription": "GPS Lat Long"
};

/**
 * StorageService handler
 */
class StorageService extends cds.ApplicationService {

	/**
	 * Sends a message to all connected clients
	 * @param {Object} messageContent 
	 */
	sendMessageToConnectedClients(messageContent) {

		// Loop through all connected clients
		for (const client of global.wss.clients) {
			client.send(JSON.stringify(messageContent));
		}

	}


	async init() {
		let messaging = await cds.connect.to("messaging");
		const db = await cds.connect.to("db");
		const { Devices } = db.entities;

		// Connect to SAP S/4 services
		const ehs = await cds.connect.to("API_EHS_REPORT_INCIDENT_SRV");
		const eam = await cds.connect.to("API_EAM_SERVICE");

		const { NotifHeadSet } = eam.entities;
		// eslint-disable-next-line camelcase
		const { A_Incident } = ehs.entities;
		const { Crumbs } = this.entities;

		// To output the message we can initiate through CAP
		messaging.on("gpslocation", async message => {
			await this.post("Crumbs", message.data);
		});

		this.before("CREATE", "Crumbs", async context => {
			const { data } = context;
			const tx = db.tx(context);

			data.Device_ID = data.deviceId;

			let result;
			result = await tx.run(SELECT.one.from(Devices).where({ ID: data.Device_ID }));

			if (!result) {
				// Create new device
				await tx.run(INSERT.into(Devices).entries([{
					ID: data.Device_ID
				}]));
				result = await tx.run(SELECT.one.from(Devices).where({ ID: data.Device_ID }));
			}

			if (!result.notification && data.emergencyContacted) {

				// Create new notification
				let shortText = data.personId + " in an incident";

				// Create EHS incident
				let ehsRecord = ehsTemplate;
				ehsRecord.IncidentTitle = shortText;
				ehsRecord.IncidentUTCDateTime = new Date().toISOString();
				ehsRecord.IncidentLocationDescription = "An incident has been reported on device: "
					+ data.Device_ID + " at GPS location: " + data.locationLat + ","
					+ data.locationLong + " with an Accelerometer Score of: "
					+ data.accelerometerScore + ".";

				const EhsIncident = await ehs.run(INSERT.into(A_Incident).entries([ehsRecord]));

				// Create EAM Notification
				const record = Object.assign(eamTemplate, { ShortText: shortText });
				const notification = await eam.run(INSERT.into(NotifHeadSet).entries([record]));

				// Update Device entity with SAP info
				await tx.run(UPDATE(Devices)
					.with({
						notification: notification.NotifNo,
						ehsincident: EhsIncident.IncidentUUID
					})
					.where({ ID: data.Device_ID }));
			}

			if (result.notification && !data.emergencyContacted) {
				// Clear Notification ID and ESH Incident ID
				await tx.run(UPDATE(Devices)
					.with({
						notification: null,
						ehsincident: null
					})
					.where({ ID: data.Device_ID }));
			}
		});


		// We are using this event handler to send the stored Crumbs to all connected clients
		this.after(["CREATE"], "Crumbs", async (data) => {
			console.log("After CREATE Crumbs", data);
			const result = await this.run(SELECT.one.from(Crumbs).where({ ID: data.ID }));

			this.sendMessageToConnectedClients(result);
			console.log("Message sent to clients!");
		});

		// ensure to call super.init()
		await super.init();

	}

}

module.exports = { StorageService };