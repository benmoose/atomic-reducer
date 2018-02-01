'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// define names
var mapping = exports.mapping = {
  entities: 'entities',
  order: 'order',
  selected: 'selected',
  loading: 'loading',
  error: 'error'

  // define initialState
};var initialState = exports.initialState = function initialState(mapping) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, mapping.entities, {}), _defineProperty(_ref, mapping.order, []), _defineProperty(_ref, mapping.selected, null), _defineProperty(_ref, mapping.loading, false), _defineProperty(_ref, mapping.error, null), _ref;
};

// define logic
var logic = exports.logic = {
  request: function request(state, action) {
    return _extends({}, state, _defineProperty({}, mapping.loading, true));
  },
  success: function success(state, action) {
    var _extends3;

    return _extends({}, state, (_extends3 = {}, _defineProperty(_extends3, mapping.entities, _extends({}, state.entities, action.payload)), _defineProperty(_extends3, mapping.loading, false), _extends3));
  },
  failure: function failure(state, action) {
    var _extends4;

    return _extends({}, state, (_extends4 = {}, _defineProperty(_extends4, mapping.loading, false), _defineProperty(_extends4, mapping.error, action.payload), _extends4));
  },
  setOrder: function setOrder(state, action) {
    return _extends({}, state, _defineProperty({}, mapping.order, action.payload));
  },
  setSelected: function setSelected(state, action) {
    return _extends({}, state, _defineProperty({}, mapping.selected, action.payload));
  }
};