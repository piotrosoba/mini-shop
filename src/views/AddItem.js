import React from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { saveItemAsyncActionCreator } from '../state/user'
import { addSnackbarActionCreator } from '../state/snackbars'

import { TextField, Button, Typography } from '@material-ui/core'

const styles = {
  div: { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 400, margin: '0 auto' },
  input: { margin: 10, width: 300 }
}

const AddItem = props => {
  const [name, setName] = React.useState('')
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

  const [description, setDescription] = React.useState('')
  const [descriptionError, setDescriptionError] = React.useState(false)
  const descriptionValidate = (value = description) => {
    value = value && value.replace(/\s{2,}/g, ' ')
    if (value)
      setDescription(value)
    const isError = !value || value.length < 15
    setDescriptionError(isError)
    return isError
  }

  const [price, setPrice] = React.useState(0)
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


  const [photo, setPhoto] = React.useState('')
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
      props._saveItem(item)
        .then(() => {
          setName('')
          setPhoto('')
          setPrice(1)
          setDescription('')
          props._snackbar('Item added')
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

    },
    {
      name: 'description',
      multiline: true,
      value: description,
      change: setDescription,
      error: descriptionError,
      errorText: 'Too short name, minimum 15 characters',
      validate: descriptionValidate
    },
    {
      name: 'price',
      type: 'number',
      value: price,
      change: setValidPrice,
      error: priceError,
      errorText: 'Tell the price!',
      validate: priceValidate
    },
    {
      name: 'photo(url)',
      placeholder: 'http://',
      value: photo,
      change: setPhoto,
      error: photoError,
      errorText: 'Invalid URL, it must start with http:// or https://',
      validate: photoValidate
    }
  ]

  return (
    <div style={styles.div}>
      <Typography
        align='center'
        variant='h4'
      >
        You can add items here.
        <br />
        This items will be added to <Link to='/own-shop'>your items list.</Link>
      </Typography>
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
          onKeyPress={submitOnEnter}
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
      <Typography
        align='center'
        style={{ margin: '-10px 0 10px 0', cursor: 'pointer' }}
        color='primary'
        onClick={() => {
          setPhoto('http://lorempixel.com/400/400/')
          setPhotoError(false)
        }}
      >
        (random photo)
      </Typography>
      <Button
        variant='contained'
        color='primary'
        onClick={onSubmit}
      >
        Add
      </Button>

    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  _saveItem: item => dispatch(saveItemAsyncActionCreator(item)),
  _snackbar: (text, color) => dispatch(addSnackbarActionCreator(text, color))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddItem)