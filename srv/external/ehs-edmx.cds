/* checksum : 21799fedff8bbd5b1ce034a44934553f */
@cds.external : true
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service API_EHS_REPORT_INCIDENT_SRV {};

@cds.persistence.skip : true
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
@m.HasStream : 'true'
@sap.label : 'Attachment'
entity API_EHS_REPORT_INCIDENT_SRV.A_Attachment {
  @sap.unicode : 'false'
  @sap.label : 'Attachment Global Identification'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key AttachmentDocumentUUID : UUID;
  @sap.unicode : 'false'
  @sap.label : 'Attachment MIME Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  MimeType : String(128);
  @sap.unicode : 'false'
  @sap.label : 'Attachment File Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  FileName : String(255);
};

@cds.persistence.skip : true
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.searchable : 'true'
@sap.content.version : '1'
@sap.label : 'Incident'
entity API_EHS_REPORT_INCIDENT_SRV.A_Incident {
  @sap.unicode : 'false'
  @sap.label : 'Incident Global Identification'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key IncidentUUID : UUID;
  @sap.unicode : 'false'
  @sap.label : 'Incident Category'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IncidentCategory : String(3);
  @sap.unicode : 'false'
  @sap.label : 'Incident Status'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  IncidentStatus : String(40);
  @sap.unicode : 'false'
  @sap.label : 'Incident Title'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  IncidentTitle : String(80);
  @odata.type : 'Edm.DateTimeOffset'
  @odata.precision : 0
  @sap.unicode : 'false'
  @sap.label : 'Incident Start Date/Time (UTC)'
  @sap.updatable : 'false'
  IncidentUTCDateTime : DateTime;
  @sap.unicode : 'false'
  @sap.label : 'Additional Description of Incident Location'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  IncidentLocationDescription : String(999999);
  @sap.unicode : 'false'
  @sap.label : 'Location Global Identification'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  EHSLocationUUID : UUID;
  @cds.ambiguous : 'missing on condition?'
  to_Attachments : Association to many API_EHS_REPORT_INCIDENT_SRV.A_Attachment on to_Attachments.AttachmentDocumentUUID = IncidentUUID;
  @cds.ambiguous : 'missing on condition?'
  to_Persons : Association to many API_EHS_REPORT_INCIDENT_SRV.A_Person on to_Persons.PersonInvolvedUUID = IncidentUUID;
  @cds.ambiguous : 'missing on condition?'
  to_Location : Association to API_EHS_REPORT_INCIDENT_SRV.A_Location on to_Location.LocationUUID = IncidentUUID;
};

@cds.persistence.skip : true
@sap.creatable : 'false'
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.content.version : '1'
@sap.label : 'Location'
entity API_EHS_REPORT_INCIDENT_SRV.A_Location {
  @sap.unicode : 'false'
  @sap.label : 'Location Global Identification'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key LocationUUID : UUID;
  @sap.unicode : 'false'
  @sap.label : 'Location Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  LocationName : String(60);
  @sap.unicode : 'false'
  @sap.label : 'Location Type'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  LocationType : String(40);
  @sap.unicode : 'false'
  @sap.label : 'Geo Location for Latitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  LocationLatitude : Decimal(15, 12);
  @sap.unicode : 'false'
  @sap.label : 'Geo Location for Longtitude'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  LocationLongtitude : Decimal(15, 12);
};

@cds.persistence.skip : true
@sap.updatable : 'false'
@sap.deletable : 'false'
@sap.pageable : 'false'
@sap.addressable : 'false'
@sap.content.version : '1'
@sap.label : 'Person'
entity API_EHS_REPORT_INCIDENT_SRV.A_Person {
  @sap.unicode : 'false'
  @sap.label : 'Person Role'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  key PersonInvolvedRole : String(21);
  @sap.unicode : 'false'
  @sap.label : 'Person Global Identification'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  @sap.filterable : 'false'
  key PersonInvolvedUUID : UUID;
  @sap.unicode : 'false'
  @sap.label : 'Person Name'
  @sap.creatable : 'false'
  @sap.updatable : 'false'
  @sap.sortable : 'false'
  PersonFullName : String(80);
};

