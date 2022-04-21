#!/bin/bash

ps -e | awk '/cds/ {print $0}'