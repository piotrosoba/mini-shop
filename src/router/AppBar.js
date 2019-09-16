import React from 'react'
import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { drawerOpenActionCreator } from '../state/drawer'
import { logOutActionCreator } from '../state/auth'

import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
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
          <Typography
            style={{ flexGrow: 1 }}
            variant="h6"
          >
            Mini Shop
          </Typography>
          <Button
            style={{ color: 'white' }}
            onClick={() => {
              props._logOut()
              props.history.push('/')
            }}

          >
            log out
          </Button>
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
)(withRouter(AppBar))