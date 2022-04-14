import RizingElement from "../base/RizingElement";

const style = require("./Map.css").toString();

const html = `
	<div id='content'>
	</div>
`;

export default class Map extends RizingElement {

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
	}

	// disconnectedCallback(): void {}

	// adoptedCallback(): void {}

	attributeChangedCallback(name: string): void {

	}
}

customElements.define("rizing-map", Map);