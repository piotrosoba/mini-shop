import React from 'react'

import { connect } from 'react-redux'
import { fullScreenCircural } from '../state/fullScreenCircural'
import { editItemAsyncActionCreator, getUserFromBaseAsyncActionCreator } from '../state/user'
import { addSnackbarActionCreator } from '../state/snackbars'

import { Dialog, DialogTitle, TextField, Button } from '@material-ui/core'

const styles = {
  dialog: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 30px' },
  input: { margin: 10, width: 300 },
  save: { margin: 10 }
}

const EditItem = props => {
  const [name, setName] = React.useState(props.item.name)
  const [nameError, setNameError] = React.useState(false)
  const nameValidate = (value = name) => {
    value = value && value.replace(/\s{2,}/g, ' ')
    if (value)
      setName(value)
    const isError = !value || value.length < 4
    setNameError(isError)
    return isError
  }
  const setValidateName = string => {
    if (string.length < 30)
      setName(string)
  }

  const [description, setDescription] = React.useState(props.item.description)
  const [descriptionError, setDescriptionError] = React.useState(false)
  const descriptionValidate = (value = description) => {
    value = value && value.replace(/\s{2,}/g, ' ')
    if (value)
      setDescription(value)
    const isError = !value || value.length < 15
    setDescriptionError(isError)
    return isError
  }

  const [price, setPrice] = React.useState(props.item.price)
  const [priceError, setPriceError] = React.useState(false)
  const priceValidate = (value = price) => {
    if (value >= 0.01) {
      value = Number(Number(value).toFixed(2))
      setPrice(value)
    }
    const isError = value <= 0.01
    setPriceError(isError)
    return isError
  }
  const setValidPrice = num => {
    setPrice(num < 0 ? 0 : num > 500 ? 500 : num)
  }

  const [photo, setPhoto] = React.useState(props.item.photo)
  const [photoError, setPhotoError] = React.useState(false)
  const photoValidate = (value = photo) => {
    const isError = !value || !value.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)
    setPhotoError(isError)
    return isError
  }

  const onSubmit = () => {
    const nameError = nameValidate()
    const descriptionError = descriptionValidate()
    const photoError = photoValidate()
    const priceError = priceValidate()
    if (!nameError && !descriptionError && !photoError && !priceError) {
      const item = { name, description, price, photo }
      props._editItem(item, props.item.key)
        .then(() => {
          props._startCircural()
          props._getUser()
            .then(() => {
              props._snackbar('Item edited')
              props.close()
            })
            .finally(() => {
              props._endCircural()
            })
        })
        .catch(() => {
          props._snackbar('Something went wrong, try again later', 'red')
        })
    }
  }

  const submitOnEnter = evt => {
    if (evt.key === 'Enter')
      onSubmit()
  }

  const inputs = [
    {
      name: 'name',
      value: name,
      change: setValidateName,
      error: nameError,
      errorText: 'Too short name, minimum 4 characters',
      validate: nameValidate,
      submitOnEnter: true

    },
    {
      name: 'description',
      multiline: true,
      value: description,
      change: setDescription,
      error: descriptionError,
      errorText: 'Too short name, minimum 15 characters',
      validate: descriptionValidate,
      submitOnEnter: false
    },
    {
      name: 'price',
      type: 'number',
      value: price,
      change: setValidPrice,
      error: priceError,
      errorText: 'Tell the price!',
      validate: priceValidate,
      submitOnEnter: true
    },
    {
      name: 'photo(url)',
      placeholder: 'http://',
      value: photo,
      change: setPhoto,
      error: photoError,
      errorText: 'Invalid URL, it must start with http:// or https://',
      validate: photoValidate,
      submitOnEnter: true
    }
  ]

  return (
    <Dialog
      onClose={props.close}
      open={props.isOpen}
      PaperProps={{ style: styles.dialog }}
    >
      <DialogTitle align='center'>
        Edit your item
        </DialogTitle>
      {inputs.map(input => (
        <TextField
          key={input.name}
          value={input.value}
          onChange={evt => {
            input.change(evt.target.value)
            if (input.error)
              input.validate(evt.target.value)
          }}
          onBlur={() => input.validate(input.value)}
          onKeyPress={input.submitOnEnter ? submitOnEnter : null}
          style={styles.input}
          label={input.name}
          variant='outlined'
          multiline={input.multiline}
          error={input.error}
          helperText={input.error ? input.errorText : null}
          type={input.type || 'text'}
          placeholder={input.placeholder}
        />
      ))}
      <Button
        color='primary'
        variant='contained'
        style={styles.save}
        onClick={onSubmit}
      >
        Save
      </Button>
    </Dialog>
  )
}

const mapDispatchToProps = dispatch => ({
  _editItem: (item, key) => dispatch(editItemAsyncActionCreator(item, key)),
  _getUser: () => dispatch(getUserFromBaseAsyncActionCreator()),
  _startCircural: () => dispatch(fullScreenCircural.add()),
  _endCircural: () => dispatch(fullScreenCircural.remove()),
  _snackbar: (text, color) => dispatch(addSnackbarActionCreator(text, color))
})

export default connect(
  null,
  mapDispatchToProps
)((EditItem))