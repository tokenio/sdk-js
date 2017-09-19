#!/bin/bash

BASEDIR=$(pwd)
PATCHDIR=$BASEDIR/config/patches

# patch lib
BUFFERDIR=$BASEDIR/node_modules/buffer
BUFFERFILENAME="index.js"

# patch js
if ! patch -R $BUFFERDIR/$BUFFERFILENAME -N --dry-run -s < $PATCHDIR/$BUFFERFILENAME.patch >/dev/null; then
    patch $BUFFERDIR/$BUFFERFILENAME < $PATCHDIR/$BUFFERFILENAME.patch -s
    echo "$BUFFERFILENAME patch applied."
else
    echo "$BUFFERFILENAME is already patched."
fi

exit 0
