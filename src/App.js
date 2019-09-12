
import React from 'react'

import { BrowserRouter as Router } from "react-router-dom"

import AppBar from './router/AppBar'
import Drawer from './router/Drawer'
import Auth from './Auth/Auth'

const App = props => {
  return (
    <div>
      <Router>
        <Auth>
          <AppBar />
          <Drawer />
        </Auth>
      </Router>
    </div>
  )
}

export default App