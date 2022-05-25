import axios from 'axios';

const protocol = document.location.protocol;
const host = protocol === 'https:' ? document.location.host : 'localhost:4004';

export default class ODataModel {

	constructor() {
		this.url = `${protocol}//${host}/storage`;
	}

	get(entity, options) {
		let url = `${this.url}/${entity}`;
		const filter = options ? options.filter : null;

		if (filter) {
			url = `${url}?$filter=${filter}`;
		}

		return new Promise((resolve, reject) => {
			axios.get(url)
				.then(result => {
					resolve(result.data.value);
				}).catch(error => {
					reject(error);
				});
		});
	};
}