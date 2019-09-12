import React from 'react'
import { Link } from "react-router-dom"


import { connect } from 'react-redux'
import { drawerOpenActionCreator } from '../state/drawer'
import { drawerCloseActionCreator } from '../state/drawer'

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import { List, ListItem, ListItemText } from '@material-ui/core'

const styles = {
  list: {
    width: 150,
  },
  link: {
    textDecoration: 'none',
    color: '#000'
  }
}

const Drawer = props => {
  return (
    <div>
      <SwipeableDrawer
        open={props._isOpen}
        onClose={props._close}
        onOpen={props._open}
      >
        <List style={styles.list}>
          <Link
            to={'/first-thing'}
            style={styles.link}
            onClick={props._close}
          >
            <ListItem button>
              <ListItemText primary={'First thing'} />
            </ListItem>
          </Link>
          <Link
            to={'/second-thing'}
            style={styles.link}
            onClick={props._close}
          >
            <ListItem button>
              <ListItemText primary={'Second thing'} />
            </ListItem>
          </Link>
        </List>
      </SwipeableDrawer>
    </div>
  )
}

const mapStateToProps = state => ({
  _isOpen: state.drawer.open
})

const mapDispatchToProps = dispatch => ({
  _open: () => dispatch(drawerOpenActionCreator()),
  _close: () => dispatch(drawerCloseActionCreator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Drawer)