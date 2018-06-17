'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = undefined;

var _utils = require('../utils');

var createReducer = exports.createReducer = function createReducer(_ref) {
  var initialState = _ref.initialState,
      logic = _ref.logic;
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _parseArgs2 = (0, _utils._parseArgs)(args),
        request = _parseArgs2.request,
        success = _parseArgs2.success,
        failure = _parseArgs2.failure,
        setOrder = _parseArgs2.setOrder,
        setSelected = _parseArgs2.setSelected,
        setEntity = _parseArgs2.setEntity;

    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
      var action = arguments[1];

      switch (action.type) {
        case request:
          return logic.request(state, action);
        case success:
          return logic.success(state, action);
        case failure:
          return logic.failure(state, action);
        case setOrder:
          return logic.setOrder(state, action);
        case setSelected:
          return logic.setSelected(state, action);
        case setEntity:
          return logic.setEntity(state, action);
        default:
          return state;
      }
    };
  };
};