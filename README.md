# Field Service Demo 2022
This repo showcases the use of CAP in the context of Field Service work. As a company, we want to have continous view on the location of our Field Service technicians. 
This demo takes it a step further and reacts to possible falls. Falls are detected based on accelerometer data from connected Iphones. 

## The components
1. At its core is a [SAP Cloud Application Programming Model](https://cap.cloud.sap/docs/) application that
    - Receives technician data from an event-mesh instance
    - Stores the data in a HANA Cloud database
    - pushes the data via Web Sockets to all connected clients
    - creates a SAP Incident in a connected S/4 on-premise 2021 instance
2. A custom built IPhone app tracks the movements of the technician and sends bread crumbs to the event-mesh instance.
3. The event-mesh instance receives the bread crumbs under a topic called 'gpslocation'
4. A simple client application visualizes the current locatiton of all our field service technicians on the map and shows an alert once a fall was detected.



