const protocol = document.location.protocol === 'https:' ? 'wss' : 'ws';
const url = `${protocol}://localhost:4004/ws`;


export default class WebSocketProvider {

	constructor() {
		this.ws = new WebSocket(url);

		// Event handler for on open
		this.ws.onopen = function(event) {
			console.log('WebSocket connection open', event.data);
		};

		// event handler for when the connection is closed
		this.ws.onclose = function(event) {
			console.log('WebSocket connection closed', event.data);
		};
	}

	attachEvent(name, handler) {
		switch (name) {
			case "messageReceived":
				this.ws.onmessage = function(event) {
					handler(JSON.parse(event.data));
				};
				break;

			default:
				throw new Error('Unsupported event name');
		}
	}
}