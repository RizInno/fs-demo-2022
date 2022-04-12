using {riz.inno.example as my} from '../db/core';

service StorageService{
    entity Crumbs as projection on my.Crumbs;
}