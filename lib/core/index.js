'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('../utils');

var createReducer = exports.createReducer = function createReducer() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _parseArgs2 = (0, _utils._parseArgs)(args),
      request = _parseArgs2.request,
      success = _parseArgs2.success,
      failure = _parseArgs2.failure,
      setOrder = _parseArgs2.setOrder,
      setSelected = _parseArgs2.setSelected;

  var initialState = {
    entities: {},
    order: [],
    selected: null,
    loading: false,
    error: null
  };

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
      case request:
        return _extends({}, state, {
          loading: true
        });
      case success:
        return _extends({}, state, {
          entities: _extends({}, state.entities, action.payload),
          loading: false
        });
      case failure:
        return _extends({}, state, {
          loading: false,
          error: action.payload
        });
      case setOrder:
        return _extends({}, state, {
          order: action.payload
        });
      case setSelected:
        return _extends({}, state, {
          selected: action.payload
        });
      default:
        return state;
    }
  };
};