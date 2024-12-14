#!/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'usage: ./download <domain-name> [image file-name]'
    echo '  e.g. ./download https://giallozafferanno.it giallozafferanno.png'
    exit 0
fi

if [[ $# -eq 2 ]] ; then
    echo "Saving to provided filename: "
    FILENAME=$2
else
	FILENAME=`echo $1 | awk -F[/:] '{print $4}'`.png
	echo "Saving to filename derived from url: " 
fi

echo "" 
echo "    $FILENAME"
echo "" 

echo "Press ENTER to continue."
read

curl https://t1.gstatic.com/faviconV2\?client\=SOCIAL\&type\=FAVICON\&fallback_opts\=TYPE,SIZE,URL\&url\=$1\&size\=48 > $FILENAME
open $FILENAME

