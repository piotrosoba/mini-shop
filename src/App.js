
import React from 'react'

import { BrowserRouter as Router, Route } from "react-router-dom"

import AppBar from './router/AppBar'
import Drawer from './router/Drawer'
import Auth from './Auth/Auth'
import Dashbord from './views/Dashbord'
import Wallet from './views/Wallet'

const App = props => {
  return (
    <div>
      <Router>
        <Auth>
          <AppBar />
          <Drawer />
          <Route path='/' exact component={Dashbord} />
          <Route path='/profile' exact component={() => <p>bedzie profil</p>} />
          <Route path='/change-password' exact component={() => <p>change password</p>} />
          <Route path='/basket' exact component={() => <p>basket</p>} />
          <Route path='/wallet' exact component={Wallet} />
        </Auth>
      </Router>
    </div>
  )
}

export default App