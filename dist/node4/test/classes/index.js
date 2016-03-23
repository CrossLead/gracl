'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PostResource = require('./PostResource');

Object.keys(_PostResource).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _PostResource[key];
    }
  });
});

var _BlogResource = require('./BlogResource');

Object.keys(_BlogResource).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _BlogResource[key];
    }
  });
});

var _UserSubject = require('./UserSubject');

Object.keys(_UserSubject).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _UserSubject[key];
    }
  });
});

var _TeamSubject = require('./TeamSubject');

Object.keys(_TeamSubject).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TeamSubject[key];
    }
  });
});

var _Organization = require('./Organization');

Object.keys(_Organization).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _Organization[key];
    }
  });
});