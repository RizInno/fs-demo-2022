#!/bin/bash

ps -e | awk '/cds/ {print $1}' | while read line; do
echo Eliminating process with id $line
kill -9 $line
done