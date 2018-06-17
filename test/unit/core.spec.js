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
      'REQUEST',
      'SUCCESS',
      'FAILURE',
      'SET_ORDER',
      'SET_SELECTED',
      'SET_ENTITY'
    )

    const reducerB = createReducer([
      'REQUEST',
      'SUCCESS',
      'FAILURE',
      'SET_ORDER',
      'SET_SELECTED',
      'SET_ENTITY'
    ])

    const reducerC = createReducer({
      request: 'REQUEST',
      success: 'SUCCESS',
      failure: 'FAILURE',
      setOrder: 'SET_ORDER',
      setSelected: 'SET_SELECTED',
      setEntity: 'SET_ENTITY'
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
      const action = { type: 'REQUEST' }
      reducers.map(reducer => (
        expect(reducer(undefined, action)).toEqual(
          expect.objectContaining({
            loading: true
          })
        )
      ))
    })

    test('sets \'loading: false\' when success `action.type` received', () => {
      const action = { type: 'SUCCESS' }
      reducers.map(reducer => (
        expect(reducer({ ...initialState, loading: true }, action)).toEqual(
          expect.objectContaining({
            loading: false
          })
        )
      ))
    })

    test('sets \'loading: false\' and \'error: `action.payload`\' when failure `action.type` received', () => {
      const action = { type: 'FAILURE', payload: new Error() }
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
      const action = { type: 'SUCCESS', payload: { b: 5 } }
      reducers.map(reducer => (
        expect(reducer(initialState, action)).toEqual(
          expect.objectContaining({
            entities: { b: 5 }
          })
        )
      ))
    })

    test('`action.payload` does not delete existing entities in state', () => {
      const action = { type: 'SUCCESS', payload: { b: 5 } }
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
      const action = { type: 'SUCCESS', payload: { a: 5 } }
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
      const action = { type: 'SET_ORDER', payload: [1, 3, 2] }
      reducers.map(reducer => (
        expect(reducer(initialState, action)).toEqual(
          expect.objectContaining({
            order: [1, 3, 2]
          })
        )
      ))
    })

    test('setOrder `action.type` overrites state\'s order', () => {
      const action = { type: 'SET_ORDER', payload: [1, 3, 2] }
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
      const action = { type: 'SET_SELECTED', payload: 5 }
      reducers.map(reducer => (
        expect(reducer(initialState, action)).toEqual(
          expect.objectContaining({
            selected: 5
          })
        )
      ))
    })

    test('entity with id `action.payload.id` merged with `action.payload` when received', () => {
      const initialStateWithEntities = {
        ...initialState,
        entities: {
          1: { id: 1, title: 'title 1' },
          2: { id: 2, title: 'title 2' },
          3: { id: 3, title: 'title 3' }
        }
      }
      const payload = { id: 2, title: 'updated' }
      const action = { type: 'SET_ENTITY', payload }
      reducers.map(reducer => {
        expect(reducer(initialStateWithEntities, action).entities).toEqual({
          1: { id: 1, title: 'title 1' },
          2: { id: 2, title: 'updated' },
          3: { id: 3, title: 'title 3' }
        })
      })
    })

    test('entity with id `action.payload.id` added to entities if new', () => {
      const initialStateWithEntities = {
        ...initialState,
        entities: {
          1: { id: 1, title: 'title 1' }
        }
      }
      const payload = { id: 'abc', title: 'title 999' }
      const action = { type: 'SET_ENTITY', payload }
      reducers.map(reducer => {
        expect(reducer(initialStateWithEntities, action).entities).toEqual({
          1: { id: 1, title: 'title 1' },
          'abc': { id: 'abc', title: 'title 999' }
        })
      })
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
      'REQUEST',
      'SUCCESS',
      'FAILURE',
      'SET_ORDER',
      'SET_SELECTED'
    )

    test('default state still returned', () => {
      const action = { type: '_' }
      expect(reducer(undefined, action)).toEqual(initialState)
    })

    test('custom request logic works as expected', () => {
      const requestAction = { type: 'REQUEST' }
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

      const successAction = { type: 'SUCCESS', payload: { a: 5 } }
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

      const failureAction = { type: 'FAILURE' }
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
