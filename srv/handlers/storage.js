const cds = require('@sap/cds');
cds.env.features.fetch_csrf = true;

const template = {
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
		const eam = await cds.connect.to("API_EAM_SERVICE");
		const { NotifHeadSet } = eam.entities;
		const { Crumbs } = this.entities;

		// To output the message we can initiate through CAP
		messaging.on('gpslocation', async msg => {
			//console.log('===> Received message on topic (riz/inno/events/gpslocation): ', msg)
			//console.log('Message sent to clients', msg.data)

			await this.post('Crumbs', msg.data);

		});

		this.before('CREATE', 'Crumbs', async context => {
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
				const record = Object.assign(template, { ShortText: data.Device_ID });
				const notification = await eam.run(INSERT.into(NotifHeadSet).entries([record]));
				await tx.run(UPDATE(Devices).with({ notification: notification.NotifNo }).where({ ID: data.Device_ID }));
			}
		});


		// We are using this event handler to send the stored Crumbs to all connected clients
		this.after(['CREATE'], 'Crumbs', async (data) => {
			console.log('After CREATE Crumbs', data);
			const result = await this.run(SELECT.one.from(Crumbs).where({ ID: data.Device_ID }));

			this.sendMessageToConnectedClients(result);
			console.log('Message sent to clients!');
		});

		// ensure to call super.init()
		await super.init();

	}

}
module.exports = { StorageService };