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

const getImage = (map, criticality) => {
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

			// Continuously repaint the map, resulting
			// in the smooth animation of the dot.
			map.triggerRepaint();

			// Return `true` to let the map know that the image was updated.
			return true;
		}
	};

	return image;
};

export default class LayerManager {

	constructor(map) {
		this.map = map;
		this._addLayer(LAYER.Positive);
		this._addLayer(LAYER.Negative);
		this._addLayer(LAYER.Critical);
		this._addLayer(LAYER.Neutral);
	}

	_addLayer(layer) {
		this.map.on('load', () => {
			this.map.addImage(layer, getImage(this.map, CRITICALITY[layer]), { pixelRatio: 4 });

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
	}

	setData(data) {
		this._setData(Object.assign(data, {
			criticality: this._getCriticality(data)
		}));
	}

	_setData(data) {
		const point = this.map.getSource(data.criticality);
		point.setData({
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [data.locationLong, data.locationLat]
					}
				}
			]
		});
	}

	_getCriticality(data) {
		const timeElapsed = new Date() - new Date(data.crumbTime);

		if (data.fallDetected) {
			if (timeElapsed > 15 * 1000) {
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