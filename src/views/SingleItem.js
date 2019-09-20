import React from 'react'

import { Typography, Paper, Button, TextField, InputAdornment } from '@material-ui/core'

const styles = {
  paper: { margin: '10px auto', padding: 20, maxWidth: 600 },
  photo: { maxWidth: 250, maxHeight: 250 },
  item: { display: 'flex' },
  itemText: { margin: 30 },
  add: { display: 'flex', justifyContent: 'flex-end', marginTop: 20 },
  quantity: { width: 130, marginRight: 20 }
}

const SingleItem = props => {
  const [quantity, setQuantity] = React.useState(1)

  const setValidQuantity = () => {
    setQuantity(Math.round(Number(quantity < 1 ? 1 : quantity > 100 ? 100 : quantity)))
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

  console.log(props)

  return (
    <div>
      <Paper
        style={styles.paper}
      >
        <div
          style={styles.item}
        >
          <img
            alt={props.item.name}
            src={props.item.photo}
            style={styles.photo}
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
          >
            Add to basket
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default SingleItem