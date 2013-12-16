var modulus = require('../modulus'),
  userConfig = require('../common/api').userConfig,
  util = require('util')
  url = require('url');

const invalid = ['username', 'userId', 'apiKey'];

exports.get = function list(name, cb) {
  userConfig.load();

  if (!userConfig.data.hasOwnProperty(name)) {
    return cb('Configuration name not found.');
  }

  modulus.io.print(util.format('%s: %s', name, userConfig.data[name]).input);

  return cb();
};

exports.set = function set(name, value, cb) {
  if (invalid.indexOf(name.toLowerCase()) >= 0) {
    //
    // Don't allow username, userId, or apiKey to be set by the user.
    //
    return cb(util.format('Cannot set value of \'%s\'', name));
  }

  userConfig.load();

  if (!userConfig.data) userConfig.data = {};

  try {
    //
    // Attempt to parse the value the JSON. This will ensure that Booleans are
    //    correctly stored as JSON rather than a string.
    //
    userConfig.data[name] = JSON.parse(value);
  } catch (e) {
    userConfig.data[name] = value;
  }

  userConfig.save(userConfig.data);
  modulus.io.print(util.format('Saved \'%s\' to \'%s\'', value, name).input);

  return cb();
};