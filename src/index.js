import { createReducer } from './core'
import { initialState, logic } from './core/defaults'

// default config
const defaults = {
  initialState,
  logic
}

// factory for custom config
const configureCreateReducer = ({ logic } = {}) => {
  // merge custom logic with default logic
  return createReducer({
    ...defaults,
    logic: { ...defaults.state, ...logic }
  })
}

// export factory
export { configureCreateReducer }

// export createReducer with default config
export default createReducer(defaults)
