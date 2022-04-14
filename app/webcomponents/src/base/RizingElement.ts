export default abstract class RizingElement extends HTMLElement {

	constructor () {
		super();
	}

	/**************************************************************************
	 * GETTERS AND SETTERS
	 **************************************************************************/

	static get observedAttributes(): string[] {
		return ["visible"];
	}

	abstract get htmlTemplate(): string;

	abstract get styleTemplate(): string;

	get data(): unknown {
		return JSON.parse(this.getAttribute("data"));
	}

	set data(value: unknown) {
		if (value) {
			this.setAttribute("data", JSON.stringify(value));
		} else {
			this.setAttribute("data", null);
		}
	}

	get visible(): boolean {
		let value: boolean;

		if (this.hasAttribute("visible")) {
			value = this.getAttribute("visible") === "true";
		} else {
			value = true;
		}

		return value;
	}

	set visible(value: boolean) {
		if (value) {
			this.setAttribute("visible", "true");
		} else {
			this.setAttribute("visible", "false");
		}
	}

	/**************************************************************************
	 * METHODS
	 **************************************************************************/

	connectedCallback(): void {
		this.attachShadow({ mode: "open" });

		const style = document.createElement("style");
		style.textContent = this.styleTemplate;
		this.shadowRoot.append(style);

		const html = document.createElement("template");
		html.innerHTML = this.htmlTemplate;
		this.shadowRoot.appendChild(html.content.cloneNode(true));
	}
}