import React from 'react'

import { Typography } from '@material-ui/core'

const SingleItem = props => {
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
      {props.item.name}
    </div>
  )
}

export default SingleItem