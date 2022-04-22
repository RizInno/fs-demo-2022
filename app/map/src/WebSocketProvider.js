const protocol = document.location.protocol === 'https:' ? 'wss' : 'ws';
const host = document.location.protocol === 'https:' ? document.location.host : 'localhost:4004';
const url = `${protocol}://${host}/ws`;


export default class WebSocketProvider {

	constructor() {
		this.ws = this.createWebSocket();
	}

	createWebSocket() {
		const ws = new WebSocket(url);

		// Event handler for on open
		ws.onopen = event => {
			console.log('WebSocket connection open', event.data);
		};

		// event handler for when the connection is closed
		ws.onclose = event => {
			console.log('WebSocket connection closed', event.data);
			// web socket gets automatically closed after few minutes,
			// therefore, recreate it whe it happens
			this.ws = this.createWebSocket();
		};

		if (this.messageReceived) {
			// reattach onmessage listener
			ws.onmessage = event => {
				this.messageReceived(JSON.parse(event.data));
			};
		}

		return ws;
	}

	attachEvent(name, handler) {
		switch (name) {
			case "messageReceived":
				this.messageReceived = handler;
				this.ws.onmessage = event => {
					handler(JSON.parse(event.data));
				};
				break;

			default:
				throw new Error('Unsupported event name');
		}
	}
}