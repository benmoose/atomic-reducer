/* globals describe, test, expect */

import {
  _isActionsObjectValid,
  _actionsObjectFromArray,
  _parseArgs
} from '../../src/utils'

const ACTION_KEYS = [
  'request',
  'success',
  'failure',
  'setOrder',
  'setSelected',
  'setEntity'
]

describe('_isActionsObjectValid', () => {
  test('returns true if actions object is valid', () => {
    const a1 = { request: 'foo' }
    const a2 = { request: 'foo', success: 'bar' }
    const a3 = { setOrder: 'foo', failure: '', _xyz: 5 }
    const a4 = {
      setSelected: 'foo',
      meta: false,
      _xyz: {
        request: 456,
        success: [1, 2, 3]
      }
    }
    expect(_isActionsObjectValid(a1, ACTION_KEYS)).toBe(true)
    expect(_isActionsObjectValid(a2, ACTION_KEYS)).toBe(true)
    expect(_isActionsObjectValid(a3, ACTION_KEYS)).toBe(true)
    expect(_isActionsObjectValid(a4, ACTION_KEYS)).toBe(true)
  })

  test('returns false if actions object is invalid', () => {
    const a1 = { request: 4 }
    const a2 = { _xyz: 'bar' }
    const a3 = { request: '', success: 'bar', failure: null }
    const a4 = { request: ['foo', 'bar', 'baz'], success: 'bop', failure: null }
    expect(_isActionsObjectValid(a1, ACTION_KEYS)).toBe(false)
    expect(_isActionsObjectValid(a2, ACTION_KEYS)).toBe(false)
    expect(_isActionsObjectValid(a3, ACTION_KEYS)).toBe(false)
    expect(_isActionsObjectValid(a4, ACTION_KEYS)).toBe(false)
  })
})

describe('_actionsObjectFromArray', () => {
  test('produces the correct actions object', () => {
    const a1 = ['REQUEST']
    const a2 = ['REQUEST', 'SUCCESS', 'FAILURE']
    const a3 = ['REQUEST', 'SUCCESS', 'FAILURE', 'SET_ORDER', 'SET_SELECTED', 'SET_ENTITY']
    const a4 = ['1', '2']
    expect(_actionsObjectFromArray(a1, ACTION_KEYS)).toEqual({
      request: 'REQUEST'
    })
    expect(_actionsObjectFromArray(a2, ACTION_KEYS)).toEqual({
      request: 'REQUEST',
      success: 'SUCCESS',
      failure: 'FAILURE'
    })
    expect(_actionsObjectFromArray(a3, ACTION_KEYS)).toEqual({
      request: 'REQUEST',
      success: 'SUCCESS',
      failure: 'FAILURE',
      setOrder: 'SET_ORDER',
      setSelected: 'SET_SELECTED',
      setEntity: 'SET_ENTITY'
    })
    expect(_actionsObjectFromArray(a4, ['one', 'two'])).toEqual({
      one: '1',
      two: '2'
    })
  })

  test('throws TypeError when given invalid arrays', () => {
    const a1 = []
    const a2 = ['FOO', 'BAR']
    expect(() => _actionsObjectFromArray(a1, ACTION_KEYS)).toThrowError(TypeError)
    expect(() => _actionsObjectFromArray(a2, ['one'])).toThrowError(TypeError)
  })
})

describe('_parseArgs', () => {
  describe('argument: object', () => {
    test('returns actions object when passed valid object', () => {
      const args = [{
        request: 'REQUEST',
        setOrder: 'SET_ORDER',
        setEntity: 'SET_ENTITY',
        foo: 'bar'
      }]
      expect(_parseArgs(args)).toEqual({
        request: 'REQUEST',
        setOrder: 'SET_ORDER',
        setEntity: 'SET_ENTITY'
      })
    })

    test('throws TypeError when given invalid object', () => {
      const args1 = [{}]
      const args2 = [{ foo: 'bar' }]
      const args3 = [{ request: null }]
      expect(() => _parseArgs(args1)).toThrowError(TypeError)
      expect(() => _parseArgs(args2)).toThrowError(TypeError)
      expect(() => _parseArgs(args3)).toThrowError(TypeError)
    })
  })

  describe('argument: array', () => {
    test('returns actions object when passed a valid array', () => {
      const args = [['REQUEST', 'SUCCESS', 'FAILURE']]
      expect(_parseArgs(args)).toEqual({
        request: 'REQUEST',
        success: 'SUCCESS',
        failure: 'FAILURE'
      })
    })
    test('throws TypeError when given invalid array', () => {
      const args1 = [['REQUEST', 5, 'FAILURE']]
      const args2 = [[]]
      expect(() => _parseArgs(args1)).toThrowError(TypeError)
      expect(() => _parseArgs(args2)).toThrowError(TypeError)
    })
  })

  describe('argument: strings', () => {
    test('returns action object when passed valid arguments', () => {
      const args = ['REQUEST', 'SUCCESS', 'FAILURE']
      expect(_parseArgs(args)).toEqual({
        request: 'REQUEST',
        success: 'SUCCESS',
        failure: 'FAILURE'
      })
    })

    test('throws TypeError when given invalid arguments', () => {
      const args1 = ['REQUEST', 5, 'FAILURE']
      const args2 = []
      expect(() => _parseArgs(args1)).toThrowError(TypeError)
      expect(() => _parseArgs(args2)).toThrowError(TypeError)
    })
  })
})
