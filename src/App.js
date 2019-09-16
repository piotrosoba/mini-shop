
import React from 'react'

import { BrowserRouter as Router, Route } from "react-router-dom"

import AppBar from './router/AppBar'
import Drawer from './router/Drawer'
import Auth from './Auth/Auth'
import Dashbord from './views/Dashbord'

const App = props => {
  return (
    <div>
      <Router>
        <Auth>
          <AppBar />
          <Drawer />
          <Route path='/' exact component={Dashbord} />
        </Auth>
      </Router>
    </div>
  )
}

export default App