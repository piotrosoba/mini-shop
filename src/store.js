import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import drawer from './state/drawer'
import fullScreenCircural from './state/fullScreenCircural'
import snackbars from './state/snackbars'
import auth from './state/auth'
import user from './state/user'
import mainItems from './state/mainItems'

const reducer = combineReducers({
  drawer,
  fullScreenCircural,
  snackbars,
  auth,
  user,
  mainItems
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
)