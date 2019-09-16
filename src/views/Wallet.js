import React from 'react'

import { connect } from 'react-redux'
import { updateWalletActionCreator } from '../state/user'

import { Typography, Slider, Button } from '@material-ui/core'

const Wallet = props => {
  const [cash, setCash] = React.useState(50)
  const handleSliderChange = (event, newValue) => {
    setCash(newValue);
  };


  return (
    <div>
      <Typography
        style={{ marginTop: 20 }}
        align='center'
        variant='h2'
      >
        Your balance: {props._ballance}$
      </Typography>
      <Typography
        style={{ marginTop: 20 }}
        align='center'
        variant='h5'
      >
        Recharge your wallet:
          </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 50, flexDirection: 'column' }}>
        <Slider
          style={{ maxWidth: 200 }}
          value={typeof cash === 'number' ? cash : 0}
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          valueLabelDisplay="on"
        />
        <Button
          style={{ marginTop: 20 }}
          variant='contained'
          color='primary'
          onClick={() => {
            if (typeof cash === 'number')
              props._updateWallet(cash)
          }}
        >
          Recharge
        </Button>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  _ballance: typeof state.user.wallet === 'number' ? state.user.wallet : 0
})

const mapDispatchToProps = dispatch => ({
  _updateWallet: (cash) => dispatch(updateWalletActionCreator(cash))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wallet)