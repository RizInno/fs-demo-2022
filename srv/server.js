const cds = require('@sap/cds');
const express = require("express");
const WebSocketServer = require('./lib/WebSocketServer');


// react on bootstrapping events...
cds.on('bootstrap', app => {
	app.use("/chat", express.static("public"));
});
cds.on('served', (cdsServer) => {
	console.log('--> served');
});
cds.on('listening', ({ server }) => {
	WebSocketServer(server);
});
// handle and override options
module.exports = (o) => {
	//o.from = 'srv/precompiled-csn.json'
	//o.app = require('express')()
	return cds.server(o); //> delegate to default server.js
};