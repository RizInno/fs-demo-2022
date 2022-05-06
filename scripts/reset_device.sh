#!/bin/bash

fs_demo_service='https://fsdemo-srv-sbx.cfapps.us10.hana.ondemand.com/storage/Devices('"'76F19B03-E2ED-4193-B774-C1D33C393C05'"')'

echo $fs_demo_service

curl_result=$(curl -X PATCH "$fs_demo_service" -H "Content-Type: application/json" -d  '{"notification": null}')

echo $curl_result

