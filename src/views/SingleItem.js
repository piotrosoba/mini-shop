import React from 'react'

import { connect } from 'react-redux'
import { addToBasketAsyncActionCreator } from '../state/user'
import { fullScreenCircural } from '../state/fullScreenCircural'

import errorImg from '../img/img-placeholder.svg'

import { Typography, Paper, Button, TextField, InputAdornment, Collapse, Divider } from '@material-ui/core'
import EditItem from './EditItem'

const styles = {
  paper: { margin: '10px auto', padding: 20, maxWidth: 600 },
  photo: { width: 250, height: 250 },
  item: { display: 'flex' },
  itemText: { margin: 30 },
  add: { display: 'flex', justifyContent: 'flex-end', marginTop: 20 },
  quantity: { width: 130, marginRight: 20 },
  collapse: { marginTop: 20 },
  backDiv: { display: 'flex', justifyContent: 'center' },
  addedText: { margin: 10 }
}

const SingleItem = props => {
  const [quantity, setQuantity] = React.useState(1)
  const [showChoosePanel, setShowChoosePanel] = React.useState(false)
  const [isItemEdditing, setIsItemEdditing] = React.useState(false)

  const setValidQuantity = () => {
    setQuantity(Math.round(Number(quantity < 1 ? 1 : quantity > 100 ? 100 : quantity)))
  }

  const onSubmit = () => {
    props._startCircural()
    props._addToBasket({ ...props.item, quantity })
      .then(() => setShowChoosePanel(true))
      .finally(props._endCircural)
  }

  if (!props.item) {
    return (
      <div>
        <Typography
          variant='h6'
          align='center'
          color='error'
        >
          Couldn't find item with ID:
      <br />
          {props.id}
        </Typography>
        <Typography
          style={{ cursor: 'pointer' }}
          align='center'
          color='primary'
          variant='h6'
          onClick={props.back}
        >
          Back to shop
      </Typography>
      </div>
    )
  }

  return (
    <div>
      <Paper
        style={styles.paper}
      >
        <div
          style={styles.item}
          className='single-item--info'
        >
          <img
            className='avatar'
            alt={props.item.name}
            src={props.item.photo}
            style={styles.photo}
            onError={evt => evt.target.src = errorImg}
          />

          <div
            style={styles.itemText}
          >
            <Typography
              variant='h5'
              align='center'
            >
              {props.item.name} - {props.item.price}$
          </Typography>
            <Typography
              variant='subtitle1'
              style={{ whiteSpace: 'pre-line' }}
            >
              {props.item.description}
            </Typography>
          </div>
        </div>
        <div
          style={styles.add}
        >
          <TextField
            value={quantity}
            onChange={evt => setQuantity(evt.target.value)}
            onBlur={setValidQuantity}
            style={styles.quantity}
            type='number'
            InputProps={{
              startAdornment: <InputAdornment position="start">Quantity:</InputAdornment>,
            }}
          />

          <Button
            variant='contained'
            color='primary'
            onClick={onSubmit}
          >
            Add to basket
          </Button>
        </div>
        {props.removeAndEdit ?
          <div
            style={styles.add}
          >
            <EditItem
              isOpen={isItemEdditing}
              item={props.item}
              close={() => setIsItemEdditing(false)}
            />
            <Button
              color='primary'
              onClick={() => setIsItemEdditing(true)}
            >
              Edit
            </Button>
            <Button
              color='secondary'
              onClick={props.remove}
            >
              Remove
            </Button>
          </div>
          :
          null
        }
        <Collapse
          in={showChoosePanel}
          style={styles.collapse}
        >
          <Divider style={styles.addedText} />
          <Typography
            align='center'
            variant='h5'
          >
            Added {quantity} {props.item.name} to basket!
          </Typography>
          <div style={styles.backDiv}>
            <Button
              color='secondary'
              onClick={props.goToBasket}
            >
              Go to basket
            </Button>
            <Button
              color='primary'
              onClick={props.back}
            >
              Back to shop
            </Button>
          </div>
        </Collapse>
      </Paper>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  _addToBasket: item => dispatch(addToBasketAsyncActionCreator(item)),
  _startCircural: () => dispatch(fullScreenCircural.add()),
  _endCircural: () => dispatch(fullScreenCircural.remove())
})

export default connect(
  null,
  mapDispatchToProps
)((SingleItem))