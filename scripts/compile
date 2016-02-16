#!/usr/bin/env bash

echo "Installing type definitions..."
typings install

echo "compiling typescript..."
./node_modules/typescript/bin/tsc -p ./src

echo "Running browserify..."
./node_modules/browserify/bin/cmd.js ./dist/index.js \
  -o ./dist/gracl.js \
  -t [ babelify --presets [ es2015 ] ]
