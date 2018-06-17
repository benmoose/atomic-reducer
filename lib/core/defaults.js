"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// default initial state (specified here to allow for future user customisation)
var initialState = exports.initialState = {
  entities: {},
  order: [],
  selected: null,
  loading: false,
  error: null

  // default logic
};var logic = exports.logic = {
  request: function request(state, action) {
    return _extends({}, state, {
      loading: true
    });
  },
  success: function success(state, action) {
    return _extends({}, state, {
      entities: _extends({}, state.entities, action.payload),
      loading: false
    });
  },
  failure: function failure(state, action) {
    return _extends({}, state, {
      loading: false,
      error: action.payload
    });
  },
  setOrder: function setOrder(state, action) {
    return _extends({}, state, {
      order: action.payload
    });
  },
  setSelected: function setSelected(state, action) {
    return _extends({}, state, {
      selected: action.payload
    });
  },
  setEntity: function setEntity(state, action) {
    return _extends({}, state, {
      entities: _extends({}, state.entities, _defineProperty({}, action.payload.id, _extends({}, state.entities[action.payload.id], action.payload)))
    });
  }
};