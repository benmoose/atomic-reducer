// define default mapping
export const defaultMapping = {
  entities: 'entities',
  order: 'order',
  selected: 'selected',
  loading: 'loading',
  error: 'error'
}

// define initialState
export const initialState = mapping => ({
  [mapping.entities]: {},
  [mapping.order]: [],
  [mapping.selected]: null,
  [mapping.loading]: false,
  [mapping.error]: null
})

// define logic
export const logic = mapping => ({
  request: (state, action) => ({
    ...state,
    [mapping.loading]: true
  }),
  success: (state, action) => ({
    ...state,
    [mapping.entities]: {
      ...state.entities,
      ...action.payload
    },
    [mapping.loading]: false
  }),
  failure: (state, action) => ({
    ...state,
    [mapping.loading]: false,
    [mapping.error]: action.payload
  }),
  setOrder: (state, action) => ({
    ...state,
    [mapping.order]: action.payload
  }),
  setSelected: (state, action) => ({
    ...state,
    [mapping.selected]: action.payload
  })
})
