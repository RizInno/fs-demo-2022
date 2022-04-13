const ws = require("ws");

module.exports = server => {
	const wss = new ws.Server({
		noServer: true,
		path: "/wss/chat"
	});

	server.on("upgrade", (request, socket, head) => {
		if (request.url === "/wss/chat") {
			wss.handleUpgrade(request, socket, head, websocket => {
				wss.emit("connection", websocket, request);
			});
		}
	});

	const broadcast = data => {
		wss.clients.forEach(client => {
			try {
				client.send(data);
			} catch (error) {
				console.log(`Broadcast error: ${error.toString()}`);
			}
		});
		console.log(`Send: ${data}`);
	};

	wss.on("connection", websocket => {
		console.log("Connected");
		websocket.on("message", (data, isBinary) => {
			const message = isBinary ? data : data.toString();
			console.log(`Received: ${message}`);
			broadcast(message);
		});
		websocket.send(JSON.stringify({
			user: "Express",
			text: "Hello from Express App!"
		}));
	});

	return wss;
};