#!/usr/bin/env node

'use strict';

var program = require('commander');
var bundlib = require('..');

var version = require('../package.json').version;

function _async(f) {
  return function () {
    var arguments$1 = arguments;

    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments$1[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _continueIgnored(value) {
  if (value && value.then) {
    return value.then(_empty);
  }
}

function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }

  if (result && result.then) {
    return result.then(void 0, recover);
  }

  return result;
}

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

function _empty() { }

program
  .version(version, "-v, --version")
  .option("-d, --dev", "create development builds")
  .option("-w, --watch", "run bundlib in watch mode")
  .action(_async(function () {

    var dev = program.dev;
    var watch = program.watch;

    return _continueIgnored(_catch(function () {
      return _awaitIgnored(bundlib.bundlib(process.cwd(), {
        dev: dev,
        watch: watch
      }));
    }, function (err) {
      // tslint:disable-next-line: no-console
      console.error(err && err.message);
    }));

  }))
  .parse(process.argv);

//# sourceMappingURL=bundlib.js.map
