import React from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { saveUserAcyncActionCreator } from '../state/user'
import { fullScreenCircural } from '../state/fullScreenCircural'
import { addSnackbarActionCreator } from '../state/snackbars'

import { Paper, Typography, Divider, Button, Link as MuiLink, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import DeleteIcon from '@material-ui/icons/Delete'


const styles = {
  paper: { margin: '10px auto', padding: 20, maxWidth: 600 },
  div: { margin: '20px 0' },
  divider: { marginLeft: '20%', marginTop: 5 },
  textField: { width: 50 },
  buyItDiv: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 20 },
  iconButton: { margin: 5 },
  icons: { display: 'flex' },
  itemContent: { display: 'flex', }
}

const Basket = props => {
  let totalPrice = 0

  const [enoughtMoney, setEnoughtMoney] = React.useState(false)
  const [buyed, setBuyed] = React.useState(false)

  const setValidEditedQuantity = (i, editedQuantity) => {
    const newQuantity = Math.round(Number(editedQuantity < 1 ? 1 : editedQuantity > 100 ? 100 : editedQuantity))
    const newBasket = props._user.basket.map((item, index) => index !== i ? item : { ...item, quantity: newQuantity })
    props._saveUser({ ...props._user, basket: newBasket }, true)
      .catch(() => props._snackbar('Couldn\'t save your changes in database! Try again later', 'red'))
  }

  const removeItem = i => {
    const newBasket = props._user.basket.filter((el, index) => index !== i)
    props._saveUser({ ...props._user, basket: newBasket }, true)
      .catch(() => props._snackbar('Couldn\'t save your changes in database! Try again later', 'red'))
  }

  const onSubmit = () => {
    totalPrice = Number(totalPrice.toFixed(2))
    if (props._user.wallet < totalPrice) {
      setEnoughtMoney(true)
    } else {
      const date = new Date(Date.now()).toLocaleDateString()
      const newWallet = Number((props._user.wallet - totalPrice).toFixed(2))
      const key = Math.random().toString(16).slice(7)
      const history = props._user.history ?
        [{ items: props._user.basket, date, totalPrice, key }, ...props._user.history]
        :
        [{ items: props._user.basket, date, totalPrice, key }]
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

  if (!props._user.basket || !Array.isArray(props._user.basket) || props._user.basket.length === 0) {
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
              <div style={styles.itemContent}>
                <Typography
                  style={{ fontSize: 20, flexGrow: 1 }}
                  variant='subtitle1'
                >
                  <Link
                    to={(item.userItem ? '/own-shop/' : '/shop/') + item.key}
                    style={{ textDecoration: 'none' }}
                  >
                    {item.name}
                  </Link>
                  &nbsp;x {item.quantity} x {item.price}$ = {(item.quantity * item.price).toFixed(2)}$
                  </Typography>
                <div
                  style={styles.icons}
                  className='basket--icons'
                >
                  <IconButton
                    style={styles.iconButton}
                    color="primary"
                    size='small'
                    onClick={() => setValidEditedQuantity(index, item.quantity + 1)}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    style={styles.iconButton}
                    color="secondary"
                    size='small'
                    onClick={() => setValidEditedQuantity(index, item.quantity - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    size='small'
                    style={styles.iconButton}
                    onClick={() => removeItem(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
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
  _saveUser: (user, dontWaitOnResolve) => dispatch(saveUserAcyncActionCreator(user, dontWaitOnResolve)),
  _startCircural: () => dispatch(fullScreenCircural.add()),
  _endCircural: () => dispatch(fullScreenCircural.remove()),
  _snackbar: (text, color) => dispatch(addSnackbarActionCreator(text, color))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Basket)