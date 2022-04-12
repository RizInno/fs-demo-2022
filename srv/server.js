const cds = require('@sap/cds')
const { WebSocket } = require('ws')

// WebSocket library
const wss = new WebSocket.Server({ noServer: true });


// react on bootstrapping events...
cds.on('bootstrap', (cdsServer) => {
    console.log('--> bootstrap')
})
cds.on('served', (cdsServer) => {
    console.log('--> served')
})
cds.on('listening', (cdsServer) => {
    console.log('--> listening')

    cdsServer.server.on('upgrade', function upgrade(request, socket, head) {

        wss.handleUpgrade(request, socket, head, function done(ws) {
            console.log("WSS HandleUpgrade ");
            wss.emit('connection', ws, request);
        });

    });

    global.wss = wss;

})
// handle and override options
module.exports = (o) => {
    //o.from = 'srv/precompiled-csn.json'
    //o.app = require('express')()
    return cds.server(o) //> delegate to default server.js
}