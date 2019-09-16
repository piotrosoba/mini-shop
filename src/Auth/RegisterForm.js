import React, { useState } from 'react'

import { connect } from 'react-redux'
import { registerUserAsyncActionCreator } from '../state/auth'
import { addSnackbarActionCreator } from '../state/snackbars'

import { Paper, TextField, Button, CircularProgress, Typography } from '@material-ui/core'

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 },
  paper: { maxWidth: 320, padding: 20 },
  buttons: { display: 'flex', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' },
  button: { marginBottom: 10 },
  circural: { display: 'flex', justifyContent: 'center', width: 80 }
}

const RegisterForm = props => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [pwd, setPwd] = useState('')
  const [pwdError, setPwdError] = useState(false)
  const [pwd2, setPwd2] = useState('')
  const [pwd2Error, setPwd2Error] = useState(false)
  const [showCircural, setShowCircural] = useState(false)

  const emailValidate = (string = email) => {
    const isError = (!string.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    setEmailError(isError)
    return isError
  }
  const pwdValidate = (string = pwd) => {
    const isError = (string.length < 8)
    setPwdError(isError)
    return isError
  }
  const pwd2Validate = (string = pwd2) => {
    const isError = (pwd !== string)
    setPwd2Error(isError)
    return isError
  }

  const signInEnable = !!email && !!pwd && !!pwd2 && !emailError && !pwdError && !pwd2Error && pwd2 === pwd

  const onSubmit = () => {
    setShowCircural(true)
    props._register(email, pwd)
      .then(props.toggleForm)
      .catch(r => {
        setShowCircural(false)
        let message = 'Something went wrong, try again later'
        switch (r.response && r.response.data.error && r.response.data.error.message) {
          case 'EMAIL_EXISTS':
            message = 'User with this email is already registered'
            break
          case 'OPERATION_NOT_ALLOWED':
            message = 'This password is not allowed, try with another'
            break
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            message = 'Too many attemps, try again later'
            break
          default:
            break
        }
        props._snackbar(message, 'red')
      })
  }

  const submitOnEnter = evt => {
    if (evt.key === 'Enter' && !emailValidate() && !pwdValidate() && !pwd2Validate())
      onSubmit()
  }

  return (
    <div style={styles.center}>
      <Paper style={styles.paper}>
        <Typography
          align='center'
          variant='h4'
        >
          Sign in!
        </Typography>
        <TextField
          value={email}
          onKeyPress={submitOnEnter}
          onChange={evt => {
            setEmail(evt.target.value)
            if (emailError)
              emailValidate(evt.target.value)
          }}
          label='email'
          variant='outlined'
          margin='normal'
          fullWidth
          error={emailError}
          helperText={emailError ? 'Wrong email' : null}
          onBlur={() => {
            emailValidate()
          }}
        />
        <TextField
          value={pwd}
          onKeyPress={submitOnEnter}
          onChange={evt => {
            setPwd(evt.target.value)
            if (pwdError) {
              pwdValidate(evt.target.value)
              if (pwd2Error)
                setPwd2Error(evt.target.value !== pwd2)
            }
          }}
          label='password'
          variant='outlined'
          margin='normal'
          fullWidth
          type='password'
          error={pwdError}
          helperText={pwdError ? 'Password must have at least 8 characters' : null}
          onBlur={() => {
            pwdValidate()
            if (pwd2Error)
              pwd2Validate()
          }}
        />
        <TextField
          value={pwd2}
          onKeyPress={submitOnEnter}
          onChange={evt => {
            setPwd2(evt.target.value)
            if (pwd2Error)
              pwd2Validate(evt.target.value)
          }}
          label='repeat password'
          variant='outlined'
          margin='normal'
          fullWidth
          type='password'
          error={pwd2Error}
          helperText={pwd2Error ? 'Passwords must be the same' : null}
          onBlur={() => {
            pwd2Validate()
          }}
        />
        <div style={styles.buttons}>
          <Button
            style={styles.button}
            color='primary'
            variant='contained'
            onClick={onSubmit}
            margin='normal'
            disabled={!signInEnable}
          >
            Sign in
          </Button>
          <div style={styles.circural}>
            {showCircural ? <CircularProgress /> : null}
          </div>
          <Button
            style={styles.button}
            color='secondary'
            variant='contained'
            onClick={props.toggleForm}
          >
            Back
          </Button>
        </div>
      </Paper>
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({
  _register: (email, pwd) => dispatch(registerUserAsyncActionCreator(email, pwd)),
  _snackbar: (text, color) => dispatch(addSnackbarActionCreator(text, color))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm)