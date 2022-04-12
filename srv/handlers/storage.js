const cds = require('@sap/cds')

/**
 * StorageService handler
 */
class StorageService extends cds.ApplicationService {

  async init() {

    // We are using this event handler to send the stored Crumbs to all connected clients
    this.after(['CREATE'], 'Crumbs', (req) => {

      console.log('=> Sending message to connected clients', req)

      // Loop through all connected clients
      for (const client of global.wss.clients) {
        client.send(JSON.stringify(req));
      }
    })

    // ensure to call super.init()
    await super.init()

  }

}
module.exports = { StorageService }