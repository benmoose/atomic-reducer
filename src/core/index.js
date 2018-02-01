import { _parseArgs } from '../utils'

export const createReducer = ({ mapping, initialState, logic }) => (...args) => {
  const { request, success, failure, setOrder, setSelected } = _parseArgs(args)
  return (state = initialState, action) => {
    switch (action.type) {
      case request: return logic.request(state, action)
      case success: return logic.success(state, action)
      case failure: return logic.failure(state, action)
      case setOrder: return logic.setOrder(state, action)
      case setSelected: return logic.setSelected(state, action)
      default: return state
    }
  }
}
