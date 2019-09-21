
import React from 'react'

import { BrowserRouter as Router, Route } from "react-router-dom"

import AppBar from './router/AppBar'
import Drawer from './router/Drawer'
import Auth from './Auth/Auth'
import Dashbord from './views/Dashbord'
import Wallet from './views/Wallet'
import ChangePassword from './views/ChangePassword'
import AddItem from './views/AddItem'
import MainItems from './views/MainItems'
import Basket from './views/Basket'

const App = props => {
  return (
    <div>
      <Router>
        <Auth>
          <AppBar />
          <Drawer />
          <Route path='/' exact component={Dashbord} />
          <Route path='/add-item' component={AddItem} />
          <Route path='/shop/:id?' component={MainItems} />
          <Route path='/profile' component={() => <p>bedzie profil</p>} />
          <Route path='/change-password' component={ChangePassword} />
          <Route path='/basket' component={Basket} />
          <Route path='/wallet' component={Wallet} />
        </Auth>
      </Router>
    </div>
  )
}

export default App