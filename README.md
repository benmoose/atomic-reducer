# ⚛ Atomic Reducer

**Atomic Reducer** encapsulates a common reducer pattern, reducing the amount
of boilerplate you need to write.

- [Introduction](#introduction)
- [Installation](#installation)
- [Why would I use this?](#why-would-i-use-this)
- [Usage](#usage)
- [Customisation](#customisation)
- [FAQ](#faq)
- [Next Steps](#next-steps)
- [Contributing](#contributing)

## Introduction

An Atomic Reducer looks like this:

```js
{
  entities: {},
  order: [],
  selected: null,
  loading: false,
  error: null
}
```

The idea is that this reducer is the smallest _atmoic_ state unit, to be composed with other atomic reducers to build more complex reducers. The advantage of this is that each entity completely manages it's own data and avoids bloated reducer logic.

## Installation

Install with npm or yarn:

```bash
npm install atomic-reducer

yarn add atomic-reducer
```

## Why would I use this?
It's common for a reducer to manage several entity types. For example a
_GitHub_ reducer might look something like this:

```js
// github reducer initial state
{
  data: {
    repos: {
      enitites: {},
      order: [],
      loading: false
    },
    usernames: {
      entities: {},
      order: [],
      loading: false
    },
    tags: {
      entities: {},
      order: [],
      loading: false
    },
    // ...maybe more, e.g. commits, followers...
  },
  loading: false,
  error: null
}
```

This can lead to bloated reducers, which have to deal with repeated logic across all these data types.

It's typical to see code like this in these bloated reducers:

```js
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REPOS_REQUEST:
      return {
        ...state,
        data: {
          ...state.data,
          repos: {
            ...state.data.repos,
            loading: true
          }
        }
      }
    case GET_REPOS_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          repos: {
            ...state.data.repos,
            entities: action.payload,
            loading: false
          }
        }
      }
    case GET_REPOS_FAILURE:
      return { /* ... */ }

    // ...and so on for each entity type...
    default: return state
  }
}
```

As you can imagine, this can easily lead to repetition. Furthermore, it becomes painful to manage nested state (setting the `loading` property for the `repo` entity takes 10 lines in this example 😵).

With atomic reducer, the above can be re-written as:

```js
import { combineReducers } from 'redux'
import createReducer from 'atomic-reducer'

const repos = createReducer(
  'GET_REPOS_REQUEST',
  'GET_REPOS_SUCCESS',
  'GET_REPOS_FAILURE'
)
const usernames = createReducer(
  'GET_USERNAMES_REQUEST',
  'GET_USERNAMES_SUCCESS',
  'GET_USERNAMES_FAILURE'
)
const tags = createReducer(
  'GET_TAGS_REQUEST',
  'GET_TAGS_SUCCESS',
  'GET_TAGS_FAILURE'
)

export default combineReducers({ repos, usernames, tags })
```

The logic for setting `loading`, `error`, `entities`, `order` and `selected` is all built in, we just need to pass in the action types.

## Usage

To create an atomic reducer, just pass the actions you want to use for that entity type to `createReducer`. You don't need to pass them all in, but you need to provide at least one (otherwise there won't be anyway to dispatch to the reducer).

As a list of arguments:

```js
const reducer = createReducer(
  'REQUEST_ACTION',
  'SUCCESS_ACTION',
  'FAILURE_ACTION',
  'SET_ORDER_ACTION',
  'SET_SELECTED_ACTION'
)
```

You can also pass actions as an object, this is useful if you only want to provide actions for, say, the setting the order. You must provide at least one of the following keys (other keys are ignored).

```js
const reducer = createReducer({
  request: 'REQUEST_ACTION',
  success: 'SUCCESS_ACTION',
  failure: 'FAILURE_ACTION',
  setOrder: 'SET_ORDER_ACTION',
  setSelected: 'SET_SELECTED_ACTION'
})
```

You can also provide actions as an array of strings, with the same constraints as above:

```js
const reducer = createReducer([
  'REQUEST_ACTION',
  'SUCCESS_ACTION',
  'FAILURE_ACTION',
  'SET_ORDER_ACTION',
  'SET_SELECTED_ACTION'
])
```

Each action has the following reducer logic:

#### `request`

_No data from action._

```js
case request:
  return {
    ...state,
    loading: true
  }
```

#### `success`

`action.payload` is merged with `state.entities`. Data is merged to prevent data loss.

```js
case success:
  return {
    ...state,
    entities: {
      ...state.entities,
      ...action.payload
    },
    loading: false
  }
```

#### `failure`

`action.payload` is used to populate `state.error`.

```js
case failure:
  return {
    ...state,
    loading: false,
    error: action.payload
  }
```
##### `setOrder`

`action.payload` sets the `state.order`.

```js
case setOrder:
  return {
    ...state,
    order: action.payload
  }
```

#### `setSelected`

`action.payload` sets `state.selected`.

```js
case setSelected:
  return {
    ...state,
    selected: action.payload
  }
```

## Customisation

You can provide a custom configuration to generate bespoke `createReducer` functions.

Currently, the only supported configuration option is `mapping`, which lets you define custom names for each field (e.g. `entities` -> `data`).

```js
import { configureCreateReducer } from 'atomic-reducer'

const customCreateReducer = configureCreateReducer({
  mapping: {
    entities: 'data',
    loading: 'isFetching'
  }
})
```

## FAQ

##### Q. I want to set entities and order at the same time

A. This is a common pattern, particuarly when using [normalizr](https://github.com/paularmstrong/normalizr) where the entities and their order are returned together. With atomic reducer you'd need to do this in two actions.

For example:

```js
const getUsers = () => (dispatch) => {
  dispatch({ type: 'GET_USERS_REQUEST' })
  return api({ url: '/users' })
    .then(res => normalize(res.data, [ user ]))
    .then(({ result, entities }) => {
      // (1) dispatch normalised data
      dispatch({
        type: 'GET_USERS_SUCCESS',
        payload: entities.users
      })
      // (2) dispatch order
      dispatch({
        type: 'SET_USERS_ORDER',
        payload: result
      })
    })
}
```

Although dispatching two actions might seem like more work, it is more explicit and gives you greater flexibility in general.
If you hate doing this, then this pattern can easily be extracted to a helper function.

## Next steps

See the project board for a list of upcoming features.

## Contributing

If you'd like to contribute then thats great! Please make a pull request against
the `master` branch, and include as much detail about what your PR does as you
can. PRs should add or update tests as necessary.
