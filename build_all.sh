#!/bin/bash

set -e

for MAKEDIR in $(find . -name Makefile)
do
    make -C $MAKEDIR
done

mkdir -p ./public
echo "<html><body>Success!</body></html>" > ./public/index.html