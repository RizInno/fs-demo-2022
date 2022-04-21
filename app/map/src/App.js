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
import mapboxgl, { Map, Marker } from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

import WebSocketProvider from "./WebSocketProvider";

const ws = new WebSocketProvider();

mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluc3RlbnppZyIsImEiOiJjazV1amZpdGwwZG92M2xucDhvbWoxMTB2In0.JWYYOv7JzUpGA51DQLQK-A';

function App() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const marker = useRef(null);
	const [lng, setLng] = useState(-122.2888);
	const [lat, setLat] = useState(47.5688);
	const [zoom, setZoom] = useState(12);

	useEffect(() => {
		if (map.current) return; // initialize map only once
		map.current = new Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});

		map.current.on('move', () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});

		ws.attachEvent("messageReceived", (data) => {
			if (!marker.current) {
				marker.current = new Marker();
				marker.current.setLngLat([map.current.getCenter().lng, map.current.getCenter().lat]);
				marker.current.addTo(map.current);
				return;
			}

			marker.current.setLngLat([data.locationLong, data.locationLat]);
		});
	});

	return (
		<ThemeProvider>
			<ShellBar
				primary-title="Geometry Explorer"
				notifications-count="5+"
				show-notifications
				show-product-switch
				show-co-pilot >
				<Button icon="nav-back" slot="startButton"></Button>
				<img slot="logo" src="./images/sap-logo-svg.svg" alt="SAP logo" />
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
