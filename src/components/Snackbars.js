import React from 'react'
import { connect } from 'react-redux'

import MuiSnackbar from '@material-ui/core/Snackbar'
import { SnackbarContent } from '@material-ui/core';


const Snackbars = props => {
  return (
    <div style={{ position: 'fixed', bottom: 0 }}>
      {props._snackbars.map((snackbar, index) => (
        <MuiSnackbar
          key={snackbar.key}
          style={{ position: 'fixed', bottom: (30 + 70 * index) }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={true}
        >
          <SnackbarContent
            style={{ backgroundColor: snackbar.color }}
            message={snackbar.text}
          />
        </MuiSnackbar>
      ))}
    </div>
  )
}

const mapStateToProps = state => ({
  _snackbars: state.snackbars.bars
})

export default connect(
  mapStateToProps,
)(Snackbars)