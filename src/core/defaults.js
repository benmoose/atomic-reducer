// default initial state (specified here to allow for future user customisation)
export const initialState = {
  entities: {},
  order: [],
  selected: null,
  loading: false,
  error: null
}

// default logic
export const logic = {
  request: (state, action) => ({
    ...state,
    loading: true
  }),
  success: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      ...action.payload
    },
    loading: false
  }),
  failure: (state, action) => ({
    ...state,
    loading: false,
    error: action.payload
  }),
  setOrder: (state, action) => ({
    ...state,
    order: action.payload
  }),
  setSelected: (state, action) => ({
    ...state,
    selected: action.payload
  }),
  setEntity: (state, action) => ({
    ...state,
    entities: {
      ...state.entities,
      [action.payload.id]: {
        ...state.entities[action.payload.id],
        ...action.payload
      }
    }
  })
}
