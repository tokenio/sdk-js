#!/bin/sh

npm version $1.$(echo $2 | sed -e "s/release-//g")

