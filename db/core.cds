using {
    cuid,
    managed
} from '@sap/cds/common';

namespace riz.inno.example;

entity Devices {
    key ID           : String(1000);
        notification : String(12);
        ehsincident  : String(50);
        Crumbs       : Association to many Crumbs
                           on Crumbs.Device = $self;
}

entity Crumbs : cuid, managed {
    crumbTime          : Timestamp;
    locationLong       : Double;
    locationLat        : Double;
    locationAccuracy   : Double;
    speedMPH           : Double;
    personId           : String(1000);
    accelerometerScore : Double;
    accelerometerX     : Double;
    accelerometerY     : Double;
    accelerometerZ     : Double;
    addressCity        : String(1000);
    addressPostalCode  : String(10);
    addressState       : String(10);
    addressStreet      : String(1000);
    fallDetected       : Boolean;
    emergencyContacted : Boolean;
    Device             : Association to one Devices;
}
