import {
	FlexBox,
	FlexBoxAlignItems,
	FlexBoxDirection,
	FlexBoxJustifyContent,
	ShellBar,
	Button,
	Avatar,
	Card,
	ThemeProvider
} from '@ui5/webcomponents-react';
import '@ui5/webcomponents-icons/dist/nav-back.js';
import './App.css';

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map } from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import WebSocketProvider from "./WebSocketProvider";

const ws = new WebSocketProvider();

mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluc3RlbnppZyIsImEiOiJjazV1amZpdGwwZG92M2xucDhvbWoxMTB2In0.JWYYOv7JzUpGA51DQLQK-A';

function App() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-101.4204);
	const [lat, setLat] = useState(41.5045);
	const [zoom, setZoom] = useState(3.63);
	const size = 200;

	// This implements `StyleImageInterface`
	// to draw a pulsing dot icon on the map.
	const pulsingDot = {
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
			context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
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
			context.fillStyle = 'rgba(255, 100, 100, 1)';
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
			map.current.triggerRepaint();

			// Return `true` to let the map know that the image was updated.
			return true;
		}
	};

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});

		map.current.on('load', () => {
			map.current.addImage('pulsing-dot', pulsingDot, { pixelRatio: 4 });

			map.current.addSource('dot-point', {
				'type': 'geojson',
				'data': {
					'type': 'FeatureCollection',
					'features': []
				}
			});

			map.current.addLayer({
				'id': 'layer-with-pulsing-dot',
				'type': 'symbol',
				'source': 'dot-point',
				'layout': {
					'icon-image': 'pulsing-dot'
				}
			});
		});

		map.current.on('move', () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});

		ws.attachEvent("messageReceived", (data) => {
			const point = map.current.getSource('dot-point');
			point.setData({
				'type': 'FeatureCollection',
				'features': [
					{
						'type': 'Feature',
						'geometry': {
							'type': 'Point',
							'coordinates': [data.locationLong, data.locationLat]
						}
					}
				]
			});
		});
	});

	return (
		<ThemeProvider>
			<ShellBar
				primary-title="Geometry Explorer"
				notifications-count="5+"
				show-notifications
				show-product-switch >
				<Button icon="nav-back" slot="startButton"></Button>
				<img slot="logo" src="./images/riz-inno-logo.png" alt="riz-inno" />
				<Avatar slot="profile">
					<img src="./images/profile-photo.jpeg" alt="profile" />
				</Avatar>
			</ShellBar>
			<FlexBox
				style={{ width: '100%', height: '100%' }}
				direction={FlexBoxDirection.Column}
				justifyContent={FlexBoxJustifyContent.Center}
				alignItems={FlexBoxAlignItems.Center}
			>
				<Card>
					<div className="sidebar">
						Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
					</div>
					<div ref={mapContainer} className="map-container" />
				</Card>
			</FlexBox>
		</ThemeProvider>
	);
}

export default App;
