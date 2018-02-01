import { createReducer } from './core'
import { defaultMapping, initialState, logic } from './core/defaults'

// factory for custom config
const configureCreateReducer = ({ mapping } = {}) => {
  const customMapping = { ...defaultMapping, ...mapping }
  return createReducer({
    // use custom mapping
    initialState: initialState(customMapping),
    logic: logic(customMapping)
  })
}

// export factory
export { configureCreateReducer }

// default config
const defaults = {
  initialState: initialState(defaultMapping),
  logic: logic(defaultMapping)
}

// export createReducer with default config
export default createReducer(defaults)
