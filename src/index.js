import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { store } from './store'

import App from './App'
import FullScreenCircural from './components/FullScreenCircural'
import Snackbars from './components/Snackbars'

ReactDOM.render(
  <Provider store={store}>
    <App />
    <FullScreenCircural />
    <Snackbars />
  </Provider>,
  document.getElementById('root')
)