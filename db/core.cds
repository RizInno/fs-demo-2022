using {
    cuid,
    managed
} from '@sap/cds/common';

namespace riz.inno.example;

entity Crumbs : cuid, managed {
    crumbTime          : Timestamp;
    locationLong       : Double;
    locationLat        : Double;
    locationAccuracy   : Double;
    speedMPH           : Double;
    personId           : String(1000);
    deviceId           : String(1000);
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
}
