import { Map as Mapbox } from "mapbox-gl";
import RizingElement from "../base/RizingElement";

const style = require("./Map.css").toString();

const html = `
	<div id='content'>
	</div>
`;

export default class Map extends RizingElement {

	private _map: Mapbox;

	constructor () {
		super();
	}

	/**************************************************************************
	 * GETTERS AND SETTERS
	 **************************************************************************/

	static get observedAttributes(): string[] {
		return RizingElement.observedAttributes.concat(["data"]);
	}

	get htmlTemplate(): string {
		return html;
	}

	get styleTemplate(): string {
		return style;
	}

	/**************************************************************************
	 * METHODS
	 **************************************************************************/

	connectedCallback(): void {
		super.connectedCallback();

		this._map = new Mapbox({
			accessToken: "pk.eyJ1IjoibWFydGluc3RlbnppZyIsImEiOiJjazV1amZpdGwwZG92M2xucDhvbWoxMTB2In0.JWYYOv7JzUpGA51DQLQK-A",
			container: this.shadowRoot.getElementById("content"),
			style: "mapbox://styles/mapbox/dark-v10",
			zoom: 5,
			center: [9.162074607821484, 48.77131197525741],
			maxBounds: [[-180, -90], [180, 90]]
		});
	}

	// disconnectedCallback(): void {}

	// adoptedCallback(): void {}

	attributeChangedCallback(name: string): void {

	}
}

customElements.define("rizing-map", Map);