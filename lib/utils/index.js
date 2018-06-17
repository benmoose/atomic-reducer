'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ACTION_KEYS = ['request', 'success', 'failure', 'setOrder', 'setSelected', 'setEntity'];

/**
 * Takes an object `obj` and returns a new object with only keys from
 * `drawFrom`.
 * @param {object} obj
 * @param {array} drawFrom
 */
var _removeNonActionKeys = function _removeNonActionKeys(obj, drawFrom) {
  return Object.keys(obj).reduce(function (acc, key) {
    if (drawFrom.includes(key)) acc[key] = obj[key];
    return acc;
  }, {});
};

/**
 * Returns true if the given object contains at least one key from `drawFrom`
 * set to a value of type string.
 */
var _isActionsObjectValid = exports._isActionsObjectValid = function _isActionsObjectValid(actionsObject, drawFrom) {
  // Filter out keys not in `drawFrom`
  var _actionsObject = _removeNonActionKeys(actionsObject, drawFrom);
  var hasAtLeastOneKey = Object.keys(_actionsObject).length > 0;
  var valuesAreStrings = Object.keys(_actionsObject).reduce(function (acc, key) {
    return acc && typeof _actionsObject[key] === 'string';
  }, true);
  return hasAtLeastOneKey && valuesAreStrings;
};

/**
 * Takes an array and returns an object with keys drawn from
 * `drawFrom` and values set to the corresponding element from
 * `arr`.
 * Throws an error if arr.length > drawFrom.length or arr.length === 0
 * @param {array} arr
 */
var _actionsObjectFromArray = exports._actionsObjectFromArray = function _actionsObjectFromArray(arr, drawFrom) {
  if (arr.length === 0 || arr.length > drawFrom.length) {
    throw TypeError('Cannot create an actions object from array that is empty or longer than\n      the length of actionKeys. The given array was of length ' + arr.length + ' but\n      length must be greater an 0 and not greater than ' + ACTION_KEYS.length + '.\n    ');
  }
  return arr.reduce(function (acc, action, i) {
    acc[drawFrom[i]] = action;
    return acc;
  }, {});
};

/**
 * Arguments passed to createReducer can be one of two types:
 * - an object with at least one key from `request`, `success`, `failure`,
 *   `setOrder`, `setSelected`,
 * - an array (min length 1) of strings in the order
 *   `request`, `success`, `failure`, `setOrder`, `setSelected`,
 * - arguments passed on after another, in the same format as the array above.
 * This function parses and validates the argument list and returns an object
 * with `request`, `success`, `failure`, `setOrder`, `setSelected` keys.
 * @param {*} args
 */
var _parseArgs = exports._parseArgs = function _parseArgs(args) {
  if (Array.isArray(args[0])) {
    // args passed as single array
    var actionsObject = _actionsObjectFromArray(args[0], ACTION_KEYS);
    if (!_isActionsObjectValid(actionsObject, ACTION_KEYS)) {
      throw TypeError('\n        If specifying action types as an array, then all arguments in the array\n        must be of type \'string\'.\n      ');
    }
    return actionsObject;
  } else if (_typeof(args[0]) === 'object') {
    // args passed an sigle object
    var _actionsObject2 = _removeNonActionKeys(args[0], ACTION_KEYS);
    if (!_isActionsObjectValid(args[0], ACTION_KEYS)) {
      throw TypeError('\n        If specifying action types as an object, then the object must contain at\n        least one key from: ' + ACTION_KEYS.join(', ') + '.\n      ');
    }
    return _actionsObject2;
  } else if (typeof args[0] === 'string') {
    // args passed as string one after the other
    var _actionsObject3 = _actionsObjectFromArray(args, ACTION_KEYS);
    if (!_isActionsObjectValid(_actionsObject3, ACTION_KEYS)) {
      throw TypeError('\n        If specifying action types as argument strings, then all arguments must be\n        of type \'string\'.\n      ');
    }
    return _actionsObject3;
  }
  throw TypeError('\n    Arguments must be either be string, array of strings or object.\n  ');
};