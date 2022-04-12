using {
    cuid,
    managed
} from '@sap/cds/common';

namespace riz.inno.example;

entity Crumbs : cuid, managed {
    crumbTime        : Timestamp;
    locationLong     : Double;
    locationLat      : Double;
    locationAccuracy : Double;
    speed            : Double;
    personId         : String(1000);
    deviceId         : String(1000);
}
