#!/usr/bin/env bash

echo "Installing type definitions..."
typings install

echo "compiling typescript..."
./node_modules/typescript/bin/tsc -p ./

echo "Running browserify..."
./node_modules/browserify/bin/cmd.js ./dist/index.js \
  -o ./dist/gracl.js \
  -t [ babelify --presets [ es2015 ] ]

echo "Minifying..."
./node_modules/uglifyjs/bin/uglifyjs ./dist/gracl.js \
  --screw-ie8 \
  --mangle \
  -o  ./dist/gracl.min.js
