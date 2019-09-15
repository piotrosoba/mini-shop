import React from 'react'

import { connect } from 'react-redux'
import { drawerOpenActionCreator } from '../state/drawer'
import { logOutActionCreator } from '../state/auth'

import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'


function AppBar(props) {
  return (
    <div style={{ height: 60 }}>
      <MuiAppBar >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={props._open}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            onClick={props._logOut}
          >
            log out
          </IconButton>
        </Toolbar>
      </MuiAppBar>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  _open: () => dispatch(drawerOpenActionCreator()),
  _logOut: () => dispatch(logOutActionCreator())
})

export default connect(
  null,
  mapDispatchToProps
)(AppBar)