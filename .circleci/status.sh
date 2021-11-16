#!/bin/bash

set -o pipefail

source=""
if [ "$1" = "master" ]; then
    source="http://jsonplaceholder.typicode.com"
fi

status_code=$(curl -o /dev/null -s -w "%{http_code}\n" "${source}")

if [[ "${status_code}" -ne 200 ]] ; then
    echo "The site isn't up and the status code is ${status_code}"
    exit 1
else
    echo "The site is up and running with a status code of ${status_code}"
fi


