'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureCreateReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require('./core');

var _defaults = require('./core/defaults');

// factory for custom config
var configureCreateReducer = function configureCreateReducer() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      mapping = _ref.mapping;

  var customMapping = _extends({}, _defaults.defaultMapping, mapping);
  return (0, _core.createReducer)({
    // use custom mapping
    initialState: (0, _defaults.initialState)(customMapping),
    logic: (0, _defaults.logic)(customMapping)
  });
};

// export factory
exports.configureCreateReducer = configureCreateReducer;

// default config

var defaults = {
  initialState: (0, _defaults.initialState)(_defaults.defaultMapping),
  logic: (0, _defaults.logic)(_defaults.defaultMapping)

  // export createReducer with default config
};exports.default = (0, _core.createReducer)(defaults);