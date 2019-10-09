#!/bin/bash

set -e

for MAKEDIR in $(find . -name Makefile)
do
    make -C $MAKEDIR
done