import { Popup } from 'mapbox-gl';

const CRITICALITY = {
	Positive: ['65,190,65', '160,222,160'],
	Negative: ['255,0,0', '255,128,128'],
	Critical: ['247,151,8', '251,203,131'],
	Neutral: ['119,130,136', '187,193,196']
};

const LAYER = {
	Positive: 'Positive',
	Negative: 'Negative',
	Critical: 'Critical',
	Neutral: 'Neutral'
};

const replace = (array, oldData, newData) => {
	array.splice(array.indexOf(oldData), 1, newData);
	return array;
};

const getImage = (map, criticality, isAnimated) => {
	const size = 200;

	// This implements `StyleImageInterface`
	// to draw a pulsing dot icon on the map.
	const image = {
		width: size,
		height: size,
		data: new Uint8Array(size * size * 4),

		// When the layer is added to the map,
		// get the rendering context for the map canvas.
		onAdd: function() {
			const canvas = document.createElement('canvas');
			canvas.width = this.width;
			canvas.height = this.height;
			this.context = canvas.getContext('2d');
		},

		// Call once before every frame where the icon will be used.
		render: function() {
			const duration = 1000;
			const t = (performance.now() % duration) / duration;

			const radius = (size / 2) * 0.3;
			const outerRadius = (size / 2) * 0.7 * t + radius;
			const context = this.context;

			if (isAnimated) {
				// Draw the outer circle.
				context.clearRect(0, 0, this.width, this.height);
				context.beginPath();
				context.arc(
					this.width / 2,
					this.height / 2,
					outerRadius,
					0,
					Math.PI * 2
				);
				context.fillStyle = `rgba(${criticality[1]}, ${1 - t})`;
				context.fill();
			}

			// Draw the inner circle.
			context.beginPath();
			context.arc(
				this.width / 2,
				this.height / 2,
				radius,
				0,
				Math.PI * 2
			);
			context.fillStyle = `rgba(${criticality[0]}, 1)`;
			context.strokeStyle = 'white';
			context.lineWidth = 2 + 4 * (1 - t);
			context.fill();
			context.stroke();

			// Update this image's data with data from the canvas.
			this.data = context.getImageData(
				0,
				0,
				this.width,
				this.height
			).data;

			if (isAnimated) {
				// Continuously repaint the map, resulting
				// in the smooth animation of the dot.
				map.triggerRepaint();
			}

			// Return `true` to let the map know that the image was updated.
			return true;
		}
	};

	return image;
};

const getDescription = data => {
	return `<strong>${data.personId}'s current location as of ${new Date().toISOString().substring(11, 19)}</strong>
	<p>${data.addressStreet}, ${data.addressCity}, ${data.addressState} ${data.addressPostalCode}</p>`;
};

export default class LayerManager {

	constructor(map) {
		this.map = map;
		this.data = [];

		this.popup = new Popup({
			closeButton: false,
			closeOnClick: false
		});

		this._addLayer(LAYER.Positive);
		this._addLayer(LAYER.Negative);
		this._addLayer(LAYER.Critical);
		this._addLayer(LAYER.Neutral);
	}

	_addLayer(layer) {
		this.map.on('load', () => {
			const isAnimated = (layer === LAYER.Critical || layer === LAYER.Negative) ? true : false;
			this.map.addImage(layer, getImage(this.map, CRITICALITY[layer], isAnimated), { pixelRatio: 4 });

			this.map.addSource(layer, {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: []
				}
			});

			this.map.addLayer({
				id: layer,
				type: 'symbol',
				source: layer,
				layout: {
					'icon-image': layer
				}
			});
		});

		this.map.on('mouseenter', layer, event => {
			// Change the cursor style as a UI indicator.
			this.map.getCanvas().style.cursor = 'pointer';

			// Copy coordinates array.
			const coordinates = event.features[0].geometry.coordinates.slice();
			const description = getDescription(event.features[0].properties);

			// Ensure that if the map is zoomed out such that multiple
			// copies of the feature are visible, the popup appears
			// over the copy being pointed to.
			while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			// Populate the popup and set its coordinates
			// based on the feature found.
			this.popup.setLngLat(coordinates)
				.setHTML(description)
				.addTo(this.map);
		});

		this.map.on('mouseleave', layer, () => {
			this.map.getCanvas().style.cursor = '';
			this.popup.remove();
		});
	}

	setData(data) {
		this._setData(Object.assign(data, {
			criticality: this._getCriticality(data)
		}));
	}

	refresh() {
		this.data.forEach(record => {
			const newCriticality = this._getCriticality(record);

			if (newCriticality !== record.criticality) {
				const newRecord = Object.assign({}, record);
				newRecord.criticality = newCriticality;
				this._setData(newRecord);
			}
		});
	}

	_setData(data) {
		const oldData = this.data.find(record => record.deviceId === data.deviceId);
		let point = this.map.getSource(data.criticality);
		let layerData;

		if (!oldData) {
			this.data.push(data);
			layerData = this.data.filter(record => record.criticality === data.criticality);
			point.setData(this._getGeoJson(layerData));
		} else {
			this.data = replace(this.data, oldData, data);
			layerData = this.data.filter(record => record.criticality === data.criticality);
			point.setData(this._getGeoJson(layerData));

			if (data.criticality !== oldData.criticality) {
				point = this.map.getSource(oldData.criticality);
				layerData = this.data.filter(record => record.criticality === oldData.criticality);
				point.setData(this._getGeoJson(layerData));
			}
		}
	}

	_getGeoJson(data) {
		const collection = {
			type: 'FeatureCollection',
			features: []
		};

		data.forEach(record => {
			collection.features.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [record.locationLong, record.locationLat]
				},
				properties: record
			});
		});

		return collection;
	}

	_getCriticality(data) {
		const timeElapsed = new Date() - new Date(data.crumbTime);

		if (data.fallDetected) {
			if (data.emergencyContacted) {
				return LAYER.Negative;
			} else {
				return LAYER.Critical;
			}
		} else {
			if (timeElapsed > 5 * 60 * 1000) {
				return LAYER.Neutral;
			} else {
				return LAYER.Positive;
			}
		}
	}
}