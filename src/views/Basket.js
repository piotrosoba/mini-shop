import React from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { saveUserAcyncActionCreator } from '../state/user'
import { fullScreenCircural } from '../state/fullScreenCircural'
import { addSnackbarActionCreator } from '../state/snackbars'

import { Paper, Typography, Divider, Button, TextField, InputAdornment, Link as MuiLink } from '@material-ui/core'

const styles = {
  paper: { margin: '10px auto', padding: 20, maxWidth: 600 },
  div: { margin: '20px 0' },
  divider: { marginLeft: '20%', marginTop: 5 },
  textField: { width: 50 },
  buyItDiv: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 20 }
}

const Basket = props => {
  let totalPrice = 0

  const basketLength = props._user.basket && props._user.basket.length

  const [isEdit, setIsEdit] = React.useState(basketLength ? new Array(basketLength).fill(false) : null)
  const [editedQuantity, setEditedQuantity] = React.useState(1)
  const [enoughtMoney, setEnoughtMoney] = React.useState(false)
  const [buyed, setBuyed] = React.useState(false)

  const toggleEditItem = (i, quantity) => {
    setEditedQuantity(quantity)
    setIsEdit(isEdit.map((el, index) => i === index ? true : false))
  }

  const setValidEditedQuantity = (i) => {
    setIsEdit(isEdit.map(() => false))
    const newQuantity = Math.round(Number(editedQuantity < 1 ? 1 : editedQuantity > 100 ? 100 : editedQuantity))
    setEditedQuantity(newQuantity)
    const newBasket = props._user.basket.map((item, index) => index !== i ? item : { ...item, quantity: newQuantity })
    props._startCircural()
    props._saveUser({ ...props._user, basket: newBasket })
      .finally(props._endCircural)
  }

  const setValidEditedQuantityOnEnter = (key, i) => {
    if (key === 'Enter')
      setValidEditedQuantity(i)
  }

  const removeItem = i => {
    const newBasket = props._user.basket.filter((el, index) => index !== i)
    props._saveUser({ ...props._user, basket: newBasket })
  }

  const onSubmit = () => {
    totalPrice = Number(totalPrice.toFixed(2))
    if (props._user.wallet < totalPrice) {
      setEnoughtMoney(true)
    } else {
      const date = new Date(Date.now()).toLocaleDateString()
      const newWallet = Number((props._user.wallet - totalPrice).toFixed(2))
      const history = props._user.history ?
        [{ items: props._user.basket, date, totalPrice }, ...props._user.history]
        :
        [{ items: props._user.basket, date, totalPrice }]
      props._startCircural()
      props._saveUser({
        ...props._user,
        basket: [],
        wallet: newWallet,
        history
      })
        .then(() => setBuyed(true))
        .catch(() => props._snackbar('Something went wrong, try again later!', 'red'))
        .finally(props._endCircural)
    }
  }

  if (buyed) {
    return (
      <Typography
        variant='h4'
        align='center'
      >
        Thank you for taking the time to check my app!
        <br />
        Your order went to <Link to='/history' style={{ textDecoration: 'none' }}>history</Link>.
        <br />
        If you want to contact me check my <MuiLink href='https://piotrosoba.github.io' target='_blank' style={{ textDecoration: 'none' }}>portfolio</MuiLink> or mail to: piotrosoba@outlook.com
      </Typography>
    )
  }

  if (!props._user.basket || props._user.basket.length === 0) {
    return (
      <div>
        <Paper
          style={styles.paper}
        >
          <Typography
            align='center'
            variant='h4'
          >
            You don't have any item in basket! Go to
            <Link to='/shop' style={{ textDecoration: 'none', fontWeight: 'bold' }}> shop </Link>
            and add some!
          </Typography>
        </Paper>
      </div>
    )
  }

  return (
    <div>
      <Paper
        style={styles.paper}
      >
        {props._user.basket.map((item, index) => {
          totalPrice += item.quantity * item.price
          return (
            <div
              key={item.key}
              style={styles.div}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap' }}>
                  <Typography
                    style={{ fontSize: 20 }}
                    variant='subtitle1'
                  >
                    <Link
                      to={'/shop/' + item.key}
                      style={{ textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                    &nbsp;x&nbsp;
                  </Typography>
                  {isEdit[index] ?
                    <TextField
                      value={editedQuantity}
                      onChange={evt => setEditedQuantity(evt.target.value)}
                      onBlur={() => setValidEditedQuantity(index)}
                      onKeyPress={evt => setValidEditedQuantityOnEnter(evt.key, index)}
                      style={styles.textField}
                      autoFocus
                      type='number'
                      InputProps={{
                        startAdornment: <InputAdornment position="start">&nbsp;</InputAdornment>,
                      }}
                    />
                    :
                    <Typography
                      style={{ fontSize: 20 }}
                      variant='subtitle1'
                    >
                      {item.quantity}
                    </Typography>}
                  <Typography
                    style={{ fontSize: 20 }}
                    variant='subtitle1'
                  >
                    &nbsp;x {item.price}$ = {item.quantity * item.price}$
                  </Typography>
                </div>
                <div>
                  <Button
                    color='primary'
                    onClick={() => toggleEditItem(index, item.quantity)}
                  >
                    Edit
            </Button>
                  <Button
                    color='secondary'
                    onClick={() => removeItem(index)}
                  >
                    Remove
            </Button>
                </div>
              </div>
              <Divider style={styles.divider} />
            </div>
          )
        })}
        <Typography
          align='right'
          variant='h5'
        >
          Total price: {totalPrice.toFixed(2)}$
        </Typography>
        <div
          style={styles.buyItDiv}
        >
          {enoughtMoney ?
            <Typography
              gutterBottom
              color='error'
            >
              You don't have enough money! Reacharge <Link to='/wallet'>wallet</Link>!
          </Typography>
            :
            null
          }
          <Button
            variant='contained'
            color='primary'
            onClick={onSubmit}
          >
            Buy it!
        </Button>
        </div>
      </Paper>
    </div>
  )
}

const mapStateToProps = state => ({
  _user: state.user
})

const mapDispatchToProps = dispatch => ({
  _saveUser: user => dispatch(saveUserAcyncActionCreator(user)),
  _startCircural: () => dispatch(fullScreenCircural.add()),
  _endCircural: () => dispatch(fullScreenCircural.remove()),
  _snackbar: (text, color) => dispatch(addSnackbarActionCreator(text, color))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Basket)