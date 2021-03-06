#!/usr/bin/env bash
set -e

VERSION=`node -e "console.log(require('./package.json').version)"`
NAME="seaters-sdk";
TMP_DIR="tmp";
DIST_DIR="tmp/seaters-sdk";

echo "building ${NAME} version ${VERSION}"

set -x
npm install
npm run build
#TODO run all tests
rm -rf "$TMP_DIR"
mkdir -p "$DIST_DIR"
cp dist/seaters*.bundle.* "$DIST_DIR"
cp -r doc/* "$DIST_DIR"
cd "$TMP_DIR"
# We append -SNAPSHOT since the documentation is publish only on sdk.dev-seaters.com
tar -czf "${NAME}-${VERSION}-SNAPSHOT.tgz" seaters-sdk
cd ..
