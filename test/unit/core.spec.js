/* globals describe, test, expect */

import createReducer from '../../index'

describe('createReducer', () => {
  describe('api tests', () => {
    test('can import `createReducer`', () => {
      expect(createReducer).toBeInstanceOf(Function)
    })

    test('calling create reducer returns a function', () => {
      const result = createReducer('REQUEST')
      expect(result).toBeInstanceOf(Function)
    })

    test('throws TypeError when createReducer called without arguments', () => {
      expect(() => createReducer()).toThrowError(TypeError)
    })
  })

  describe('reducer tests', () => {
    const reducer = createReducer(
      'A_REQUEST',
      'A_SUCCESS',
      'A_FAILURE',
      'A_SET_ORDER',
      'A_SET_SELECTED'
    )

    const initialState = {
      entities: {},
      order: [],
      selected: null,
      loading: false,
      error: null
    }

    const loadingState = {
      entities: {},
      order: [],
      selected: null,
      loading: true,
      error: null
    }

    test('returns expected initial state', () => {
      const action = { type: '_' }
      expect(reducer(undefined, action)).toEqual(initialState)
    })

    test('returns given state', () => {
      const action = { type: '_' }
      expect(reducer({}, action)).toEqual({})
    })

    test('sets \'loading: true\' when request `action.type` received', () => {
      const action = { type: 'A_REQUEST' }
      expect(reducer(undefined, action)).toEqual(
        expect.objectContaining({
          loading: true
        })
      )
    })

    test('sets \'loading: false\' when success `action.type` received', () => {
      const action = { type: 'A_SUCCESS' }
      expect(reducer(loadingState, action)).toEqual(
        expect.objectContaining({
          loading: false
        })
      )
    })

    test('sets \'loading: false\' and \'error: `action.payload`\' when failure `action.type` received', () => {
      const action = { type: 'A_FAILURE', payload: new Error() }
      expect(reducer(loadingState, action)).toEqual(
        expect.objectContaining({
          loading: false,
          error: new Error()
        })
      )
    })

    test('`action.payload` moved to `entities` when success `action.type` received', () => {
      const action = { type: 'A_SUCCESS', payload: { b: 5 } }
      expect(reducer(initialState, action)).toEqual(
        expect.objectContaining({
          entities: { b: 5 }
        })
      )
    })

    test('`action.payload` does not delete existing entities in state', () => {
      const action = { type: 'A_SUCCESS', payload: { b: 5 } }
      const state = {
        ...initialState,
        entities: { a: 4 }
      }
      expect(reducer(state, action)).toEqual(
        expect.objectContaining({
          entities: { a: 4, b: 5 }
        })
      )
    })

    test('`action.payload` overrites identical keys in state', () => {
      const action = { type: 'A_SUCCESS', payload: { a: 5 } }
      const state = {
        ...initialState,
        entities: { a: 4 }
      }
      expect(reducer(state, action)).toEqual(
        expect.objectContaining({
          entities: { a: 5 }
        })
      )
    })

    test('order set to `action.payload` when setOrder `action.type` received', () => {
      const action = { type: 'A_SET_ORDER', payload: [1, 3, 2] }
      expect(reducer(initialState, action)).toEqual(
        expect.objectContaining({
          order: [1, 3, 2]
        })
      )
    })

    test('setOrder `action.type` overrites state\'s order', () => {
      const action = { type: 'A_SET_ORDER', payload: [1, 3, 2] }
      const state = {
        ...initialState,
        order: [1, 2, 3, 4, 5, 6]
      }
      expect(reducer(state, action)).toEqual(
        expect.objectContaining({
          order: [1, 3, 2]
        })
      )
    })

    test('selected set to `action.payload` when setSelected `action.type` received', () => {
      const action = { type: 'A_SET_SELECTED', payload: 5 }
      expect(reducer(initialState, action)).toEqual(
        expect.objectContaining({
          selected: 5
        })
      )
    })
  })
})
