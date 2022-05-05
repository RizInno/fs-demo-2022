#!/bin/bash

fs_demo_service=https://fsdemo-srv-sbx.cfapps.us10.hana.ondemand.com/storage/Crumbs

for FILE in ./datasets/*; do 
    echo $FILE; 

    file_content=$(cat $FILE)
    echo $file_content;

    curl_result=$(curl -X POST "$fs_demo_service" -H "Content-Type: application/json" -d  "$file_content")


done