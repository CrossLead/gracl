### Graph ACL

##### Dev setup
  Requires bash to run compilation scripts.

  1. run `npm install`
  2. run `./scripts/compile.sh`

##### Build chain (`./scripts/compile.sh`)
  1. Compile with `tsc` targeting ES6 to allow async functions, outputting directory to `./dist`
  2. Run `browserify` with `babelify` to convert ES6 -> ES5 and pull in modules, writing to `./dist/gracl.js`
  3. Uglify `./dist/gracl.js` -> `./dist/gracl.min.js`
