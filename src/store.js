import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import drawer from './state/drawer'
import fullScreenCircural from './state/fullScreenCircural'

const reducer = combineReducers({
  drawer,
  fullScreenCircural,
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)