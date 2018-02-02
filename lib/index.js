'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureCreateReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require('./core');

var _defaults = require('./core/defaults');

// default config
var defaults = {
  initialState: _defaults.initialState,
  logic: _defaults.logic

  // factory for custom config
};var configureCreateReducer = function configureCreateReducer() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      logic = _ref.logic;

  // merge custom logic with default logic
  return (0, _core.createReducer)(_extends({}, defaults, {
    logic: _extends({}, defaults.state, logic)
  }));
};

// export factory
exports.configureCreateReducer = configureCreateReducer;

// export createReducer with default config

exports.default = (0, _core.createReducer)(defaults);