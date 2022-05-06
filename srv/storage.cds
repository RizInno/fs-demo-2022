using {riz.inno.example as my} from '../db/core';

service StorageService {
    entity Crumbs as
        select from my.Crumbs {
            *,
            Device.ID           as deviceId,
            Device.notification as notification,
            case
                when
                    Device.notification    =  ''
                    or Device.notification is null
                then
                    false
                else
                    true
            end                 as isNotificationCreated : Boolean
        };
}
