#!/bin/sh
set -eu
set -a
. /root/mycarportguy-catalog/.env
set +a
exec /usr/bin/node /root/mycarportguy-catalog/server.mjs
