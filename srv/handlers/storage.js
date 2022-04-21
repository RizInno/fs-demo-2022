const cds = require('@sap/cds')

/**
 * StorageService handler
 */
class StorageService extends cds.ApplicationService {

  /**
   * Sends a message to all connected clients
   * @param {Object} messageContent 
   */
  sendMessageToConnectedClients(messageContent){

    // Loop through all connected clients
    for (const client of global.wss.clients) {
      client.send(JSON.stringify(messageContent));
    }
    
  }


  async init() {


    let messaging = await cds.connect.to("messaging")

    // To output the message we can initiate through CAP
    messaging.on('gpslocation', async msg => {
      //console.log('===> Received message on topic (riz/inno/events/gpslocation): ', msg)
      //console.log('Message sent to clients', msg.data)
      

      await this.post('Crumbs', msg.data)

    })


    // We are using this event handler to send the stored Crumbs to all connected clients
    this.after(['CREATE'], 'Crumbs', (req) => {

      console.log('After CREATE Crumbs', req)

      this.sendMessageToConnectedClients(req)
      console.log('Message sent to clients!')
    })

    // ensure to call super.init()
    await super.init()

  }

}
module.exports = { StorageService }