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

import WebSocketProvider from "./lib/WebSocketProvider";
import LayerManager from "./map/LayerManager";

const ws = new WebSocketProvider();

mapboxgl.accessToken = 'pk.eyJ1IjoibWFydGluc3RlbnppZyIsImEiOiJjazV1amZpdGwwZG92M2xucDhvbWoxMTB2In0.JWYYOv7JzUpGA51DQLQK-A';

function App() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const layer = useRef(null);

	const url = new URL(window.location.href);
	const debug = url.searchParams.get("debug");
	const paramLong = url.searchParams.get("long");
	const paramLat = url.searchParams.get("lat");
	const paramZoom = url.searchParams.get("zoom");
	const [sidebar, setSidebar] = useState((debug === "true") ? debug : "false");
	const [lng, setLng] = useState(paramLong ? parseFloat(paramLong) : -101.4204);
	const [lat, setLat] = useState(paramLat ? parseFloat(paramLat) : 41.5045);
	const [zoom, setZoom] = useState(paramZoom ? parseFloat(paramZoom) : 3.63);

	useEffect(() => {
		if (map.current) return; // initialize map only once

		map.current = new Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [lng, lat],
			zoom: zoom
		});

		layer.current = new LayerManager(map.current);

		map.current.on('move', () => {
			setLng(map.current.getCenter().lng.toFixed(4));
			setLat(map.current.getCenter().lat.toFixed(4));
			setZoom(map.current.getZoom().toFixed(2));
		});

		ws.attachEvent("messageReceived", (data) => {
			layer.current.setData(data);
		});

		setInterval(() => {
			layer.current.refresh();
		}, 5000);
	});

	return (
		<ThemeProvider>
			<ShellBar
				primary-title="Field Service Technician Monitoring"
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
					<div className="sidebar" visible={sidebar}>
						Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
					</div>
					<div ref={mapContainer} className="map-container" />
				</Card>
			</FlexBox>
		</ThemeProvider>
	);
}

export default App;
