import React from 'react'
import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'
import { drawerOpenActionCreator } from '../state/drawer'
import { logOutActionCreator } from '../state/auth'

import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Popper from '@material-ui/core/Popper'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import MenuList from '@material-ui/core/MenuList'
import MenuItem from '@material-ui/core/MenuItem'
import Badge from '@material-ui/core/Badge'

import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import WalletIcon from '@material-ui/icons/AccountBalanceWalletRounded'
import BasketIcon from '@material-ui/icons/ShoppingBasketRounded'


function AppBar(props) {
  const [openMenu, setOpenMenu] = React.useState(false)
  const anchorRef = React.useRef(null)
  const closeMenu = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenMenu(false)
  }
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
            style={{ flexGrow: 1, cursor: 'pointer' }}
            variant="h6"
            onClick={() => props.history.push('/')}
          >
            Mini Shop
          </Typography>
          <IconButton
            color='inherit'
            onClick={() => props.history.push('/basket')}
          >
            <Badge
              badgeContent={props._itemsInBasket || null}
              color='secondary'
            >
              <BasketIcon />
            </Badge>
          </IconButton>
          <IconButton
            color='inherit'
            onClick={() => props.history.push('/wallet')}
          >
            <WalletIcon />
            <Typography style={{ marginLeft: 5 }}>{props._wallet}$</Typography>
          </IconButton>
          <IconButton
            color='inherit'
            ref={anchorRef}
            onClick={() => setOpenMenu(!openMenu)}
          >
            <SettingsIcon />
          </IconButton>
          <Popper open={openMenu} anchorEl={anchorRef.current} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
              >
                <Paper id="menu-list-grow">
                  <ClickAwayListener onClickAway={closeMenu}>
                    <MenuList>
                      <MenuItem
                        onClick={evt => {
                          closeMenu(evt)
                          props.history.push('/profile')
                        }}
                      >
                        Profile
                        </MenuItem>
                      <MenuItem
                        onClick={evt => {
                          closeMenu(evt)
                          props.history.push('/change-password')
                        }}
                      >
                        Change password
                      </MenuItem>
                      <MenuItem
                        onClick={(evt) => {
                          closeMenu(evt)
                          props._logOut()
                          props.history.push('/')
                        }}
                      >
                        Logout
                          </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Toolbar>
      </MuiAppBar>
    </div>
  )
}

const mapStateToProps = state => ({
  _wallet: state.user.wallet || 0,
  _itemsInBasket: state.user.basket && Object.keys(state.user.basket).length
})

const mapDispatchToProps = dispatch => ({
  _open: () => dispatch(drawerOpenActionCreator()),
  _logOut: () => dispatch(logOutActionCreator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AppBar))