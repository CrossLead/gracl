## Graph ACL

### Build chain (`./scripts/compile.sh`)
  - Compile with `tsc` targeting ES6 to allow async functions, outputting directory to `./dist`
  - Run `browserify` with `babelify` to convert ES6 -> ES5 and pull in modules, writing to `./dist/gracl.js`
  - Uglify `./dist/gracl.js` -> `./dist/gracl.min.js`
