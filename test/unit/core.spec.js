/* globals describe, test, expect */

import createReducer, { configureCreateReducer } from '../../index'

const initialState = {
  entities: {},
  order: [],
  selected: null,
  loading: false,
  error: null
}

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
    /**
     * Define helper vars
     */
    const reducerA = createReducer(
      'A_REQUEST',
      'A_SUCCESS',
      'A_FAILURE',
      'A_SET_ORDER',
      'A_SET_SELECTED'
    )

    const reducerB = createReducer([
      'A_REQUEST',
      'A_SUCCESS',
      'A_FAILURE',
      'A_SET_ORDER',
      'A_SET_SELECTED'
    ])

    const reducerC = createReducer({
      request: 'A_REQUEST',
      success: 'A_SUCCESS',
      failure: 'A_FAILURE',
      setOrder: 'A_SET_ORDER',
      setSelected: 'A_SET_SELECTED'
    })

    const reducers = [reducerA, reducerB, reducerC]

    /**
     * Tests start
     */
    test('returns expected initial state', () => {
      const action = { type: '_' }
      reducers.map(reducer => (
        expect(reducer(undefined, action)).toEqual(initialState)
      ))
    })

    test('returns given state', () => {
      const action = { type: '_' }
      reducers.map(reducer => (
        expect(reducer({}, action)).toEqual({})
      ))
    })

    test('sets \'loading: true\' when request `action.type` received', () => {
      const action = { type: 'A_REQUEST' }
      reducers.map(reducer => (
        expect(reducer(undefined, action)).toEqual(
          expect.objectContaining({
            loading: true
          })
        )
      ))
    })

    test('sets \'loading: false\' when success `action.type` received', () => {
      const action = { type: 'A_SUCCESS' }
      reducers.map(reducer => (
        expect(reducer({ ...initialState, loading: true }, action)).toEqual(
          expect.objectContaining({
            loading: false
          })
        )
      ))
    })

    test('sets \'loading: false\' and \'error: `action.payload`\' when failure `action.type` received', () => {
      const action = { type: 'A_FAILURE', payload: new Error() }
      reducers.map(reducer => (
        expect(reducer({ ...initialState, loading: true }, action)).toEqual(
          expect.objectContaining({
            loading: false,
            error: new Error()
          })
        )
      ))
    })

    test('`action.payload` moved to `entities` when success `action.type` received', () => {
      const action = { type: 'A_SUCCESS', payload: { b: 5 } }
      reducers.map(reducer => (
        expect(reducer(initialState, action)).toEqual(
          expect.objectContaining({
            entities: { b: 5 }
          })
        )
      ))
    })

    test('`action.payload` does not delete existing entities in state', () => {
      const action = { type: 'A_SUCCESS', payload: { b: 5 } }
      const state = {
        ...initialState,
        entities: { a: 4 }
      }
      reducers.map(reducer => (
        expect(reducer(state, action)).toEqual(
          expect.objectContaining({
            entities: { a: 4, b: 5 }
          })
        )
      ))
    })

    test('`action.payload` overrites identical keys in state', () => {
      const action = { type: 'A_SUCCESS', payload: { a: 5 } }
      const state = {
        ...initialState,
        entities: { a: 4 }
      }
      reducers.map(reducer => (
        expect(reducer(state, action)).toEqual(
          expect.objectContaining({
            entities: { a: 5 }
          })
        )
      ))
    })

    test('order set to `action.payload` when setOrder `action.type` received', () => {
      const action = { type: 'A_SET_ORDER', payload: [1, 3, 2] }
      reducers.map(reducer => (
        expect(reducer(initialState, action)).toEqual(
          expect.objectContaining({
            order: [1, 3, 2]
          })
        )
      ))
    })

    test('setOrder `action.type` overrites state\'s order', () => {
      const action = { type: 'A_SET_ORDER', payload: [1, 3, 2] }
      const state = {
        ...initialState,
        order: [1, 2, 3, 4, 5, 6]
      }
      reducers.map(reducer => (
        expect(reducer(state, action)).toEqual(
          expect.objectContaining({
            order: [1, 3, 2]
          })
        )
      ))
    })

    test('selected set to `action.payload` when setSelected `action.type` received', () => {
      const action = { type: 'A_SET_SELECTED', payload: 5 }
      reducers.map(reducer => (
        expect(reducer(initialState, action)).toEqual(
          expect.objectContaining({
            selected: 5
          })
        )
      ))
    })
  })
})

describe('configureCreateReducer', () => {
  describe('api tests', () => {
    test('can import `configureCreateReducer`', () => {
      expect(configureCreateReducer).toBeInstanceOf(Function)
    })
  })

  describe('custom config tests', () => {
    const instance = configureCreateReducer({
      logic: {
        request: state => ({ ...state, loading: 'IN_PROGRESS' }),
        success: (state, action) => ({ ...state, entities: action.payload, loading: 'DONE' }),
        failure: state => ({ ...state, error: true, loading: 'DONE' })
      }
    })

    const reducer = instance(
      'A_REQUEST',
      'A_SUCCESS',
      'A_FAILURE',
      'A_SET_ORDER',
      'A_SET_SELECTED'
    )

    test('default state still returned', () => {
      const action = { type: '_' }
      expect(reducer(undefined, action)).toEqual(initialState)
    })

    test('custom request logic works as expected', () => {
      const requestAction = { type: 'A_REQUEST' }
      expect(reducer(undefined, requestAction)).toEqual({
        entities: {},
        order: [],
        selected: null,
        loading: 'IN_PROGRESS',
        error: null
      })
    })

    test('custom success logic works as expected', () => {
      const state = {
        ...initialState,
        entities: { z: 5 }
      }

      const successAction = { type: 'A_SUCCESS', payload: { a: 5 } }
      expect(reducer(state, successAction)).toEqual({
        entities: { a: 5 },  // deletes z
        order: [],
        selected: null,
        loading: 'DONE',
        error: null
      })
    })

    test('custom failure logic works as expected', () => {
      const state = {
        ...initialState,
        entities: { z: 5 }
      }

      const failureAction = { type: 'A_FAILURE' }
      expect(reducer(state, failureAction)).toEqual({
        entities: { z: 5 },
        order: [],
        selected: null,
        loading: 'DONE',
        error: true
      })
    })
  })
})
