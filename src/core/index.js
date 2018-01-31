import { _parseArgs } from '../utils'

export const createReducer = (...args) => {
  const { request, success, failure, setOrder, setSelected } = _parseArgs(args)

  const initialState = {
    entities: {},
    order: [],
    selected: null,
    loading: false,
    error: null
  }

  return (state = initialState, action) => {
    switch (action.type) {
      case request:
        return {
          ...state,
          loading: true
        }
      case success:
        return {
          ...state,
          entities: {
            ...state.entities,
            ...action.payload
          },
          loading: false
        }
      case failure:
        return {
          ...state,
          loading: false,
          error: action.payload
        }
      case setOrder:
        return {
          ...state,
          order: action.payload
        }
      case setSelected:
        return {
          ...state,
          selected: action.payload
        }
      default: return state
    }
  }
}
