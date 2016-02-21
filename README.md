## Graph ACL [![Build Status](https://travis-ci.org/CrossLead/gracl.svg?branch=master)](https://travis-ci.org/CrossLead/gracl)

  `gracl` is an Access Control List library for managing permission models utilizing a hierarchy. In `gracl`, the permissions
  hierarchy is implemented using the prototype chain, and (Java/Type)script's great reflection capabilities.

### Dev setup

  1. run `npm install`
  2. run `npm run build`

### Build chain
  1. Compile with `tsc` targeting ES6 to allow async functions, outputting directory to `./dist`
  2. Run `browserify` with `babelify` to convert ES6 -> ES5 and pull in modules, writing to `./dist/gracl.js`
  3. Uglify `./dist/gracl.js` -> `./dist/gracl.min.js`
