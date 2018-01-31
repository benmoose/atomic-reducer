const ACTION_KEYS = [
  'request',
  'success',
  'failure',
  'setOrder',
  'setSelected'
]

/**
 * Takes an object `obj` and returns a new object with keys not in `drawFrom`
 * removed.
 * @param {object} obj
 * @param {array} drawFrom
 */
const _removeNonActionKeys = (obj, drawFrom) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (drawFrom.includes(key)) acc[key] = obj[key]
    return acc
  }, {})
}

/**
 * Returns true if the given object contains at least one key from `drawFrom`
 * set to a value of type string.
 */
export const _isActionsObjectValid = (actionsObject, drawFrom) => {
  // Filter out keys not in `drawFrom`
  const _actionsObject = _removeNonActionKeys(actionsObject, drawFrom)
  const hasAtLeastOneKey = Object.keys(_actionsObject).length > 0
  const valuesAreStrings = Object.keys(_actionsObject).reduce((acc, key) => (
    acc && typeof _actionsObject[key] === 'string'
  ), true)
  return hasAtLeastOneKey && valuesAreStrings
}

/**
 * Takes an array and returns an object with keys drawn from
 * `drawFrom` and values set to the corresponding element from
 * `arr`.
 * Throws an error if arr.length > drawFrom.length or arr.length === 0
 * @param {array} arr
 */
export const _actionsObjectFromArray = (arr, drawFrom) => {
  if (arr.length === 0 || arr.length > drawFrom.length) {
    throw TypeError(
      `Cannot create an actions object from array that is longer than the length
      of actionKeys. The given array was of length ${arr.length} but it cannot
      exceed length ${ACTION_KEYS.length}.
    `)
  }
  return arr.reduce((acc, action, i) => {
    acc[drawFrom[i]] = action
    return acc
  }, {})
}

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
export const _parseArgs = (args) => {
  if (Array.isArray(args[0])) {
    // args passed as single array
    const actionsObject = _actionsObjectFromArray(args[0], ACTION_KEYS)
    if (!_isActionsObjectValid(actionsObject, ACTION_KEYS)) {
      throw TypeError(`
        If specifying action types as an array, then all arguments in the array
        must be of type 'string'.
      `)
    }
    return actionsObject
  } else if (typeof args[0] === 'object') {
    // args passed an sigle object
    const actionsObject = _removeNonActionKeys(args[0], ACTION_KEYS)
    if (!_isActionsObjectValid(args[0], ACTION_KEYS)) {
      throw TypeError(`
        If specifying action types as an object, then the object must contain at
        least one key from: ${ACTION_KEYS.join(', ')}.
      `)
    }
    return actionsObject
  } else if (typeof args[0] === 'string') {
    // args passed as string one after the other
    const actionsObject = _actionsObjectFromArray(args, ACTION_KEYS)
    if (!_isActionsObjectValid(actionsObject, ACTION_KEYS)) {
      throw TypeError(`
        If specifying action types as argument strings, then all arguments must be
        of type 'string'.
      `)
    }
    return actionsObject
  }
  throw TypeError(`
    Arguments must be either be string, array of strings or object.
  `)
}
