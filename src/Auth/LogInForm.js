import React, { useState } from 'react'

import { connect } from 'react-redux'
import { logInAsyncActionCreator, resetPasswordAsyncActionCreator } from '../state/auth'
import { addSnackbarActionCreator } from '../state/snackbars'

import { Paper, TextField, Button, Typography, CircularProgress, Collapse } from '@material-ui/core'

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 },
  paper: { maxWidth: 320, padding: 20 },
  buttons: { display: 'flex', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' },
  button: { marginBottom: 10 },
  circural: { display: 'flex', justifyContent: 'center', width: 80 }
}

const LogInForm = props => {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [pwdError, setPwdError] = useState(false)
  const [pwd, setPwd] = useState('')

  const [forgotPanel, toggleForgot] = useState(false)
  const [forgotError, setForgotError] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')

  const [circural, setCircural] = useState(false)

  const emailValidate = (string = email) => {
    const isError = (!string.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    setEmailError(isError)
    return isError
  }
  const pwdValidate = (string = pwd) => {
    setPwdError(!string)
    return !string
  }
  const forgotEmailValidate = (string = forgotEmail) => {
    const isError = (!string.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
    setForgotError(isError)
    return isError
  }

  const onSubmit = () => {
    const isEmailError = emailValidate()
    const isPwdError = pwdValidate()
    if (!isEmailError && !isPwdError) {
      setCircural(true)
      props._logIn(email, pwd)
        .catch(r => {
          setCircural(false)
          let message = 'Something went wrong, try again later'
          switch (r.response && r.response.data.error && r.response.data.error.message) {
            case 'EMAIL_NOT_FOUND':
              message = 'Invalid email or password'
              break
            case 'INVALID_PASSWORD':
              message = 'Invalid email or password'
              break
            case 'USER_DISABLED':
              message = 'This account is banned'
              break
            default:
              break
          }
          props._snackbar(message, 'red')
        })
    }
  }

  const submitOnEnter = evt => {
    if (evt.key === 'Enter')
      onSubmit()
  }

  const onSubmitPwdReset = () => {
    if (!forgotEmailValidate()) {
      setCircural(true)
      props._resetPwd(forgotEmail)
        .then(() => {
          props._snackbar('Check your email')
          toggleForgot(false)
        })
        .catch((r) => {
          let message = 'Something went wrong, try again later'
          if (r.response.data.error.message === 'EMAIL_NOT_FOUND')
            message = 'Email not found'
          props._snackbar(message, 'red')
        })
        .finally(() => setCircural(false))
    }
  }

  const submitForgotOnEnter = evt => {
    if (evt.key === 'Enter')
      onSubmitPwdReset()
  }

  return (
    <div style={styles.center}>
      <Paper style={styles.paper}>
        <Typography
          align='center'
          variant='h4'
        >
          Please log in!
        </Typography>
        <Typography
          align='center'>
          (you can use: example@example.com / 12345678)
        </Typography>
        <TextField
          value={email}
          onChange={(evt) => {
            setEmail(evt.target.value)
            if (emailError)
              emailValidate(evt.target.value)
          }}
          onBlur={() => emailValidate()}
          onKeyPress={submitOnEnter}
          fullWidth
          margin='normal'
          label='email'
          variant='outlined'
          error={emailError}
          helperText={emailError ? 'Wrong email!' : null}
        />
        <TextField
          value={pwd}
          onChange={(evt) => {
            setPwd(evt.target.value)
            if (pwdError)
              pwdValidate(evt.target.value)
          }}
          onBlur={() => pwdValidate()}
          onKeyPress={submitOnEnter}
          fullWidth
          margin='normal'
          label='password'
          variant='outlined'
          type='password'
          error={pwdError}
        />
        <div style={styles.buttons}>
          <Button
            style={styles.button}
            color='primary'
            variant='contained'
            onClick={onSubmit}
            margin='normal'
          >
            Log In
          </Button>
          <div style={styles.circural}>
            {circural ? <CircularProgress /> : null}
          </div>
          <Button
            style={styles.button}
            color='secondary'
            variant='contained'
            onClick={props.toggleForm}
          >
            Register
          </Button>
          <Button
            onClick={() => toggleForgot(!forgotPanel)}
          >
            forgot password?
        </Button>
        </div>

        <Collapse in={forgotPanel}>
          <TextField
            value={forgotEmail}
            onChange={(evt) => {
              setForgotEmail(evt.target.value)
              if (forgotError)
                forgotEmailValidate(evt.target.value)
            }}
            onBlur={() => forgotEmailValidate()}
            onKeyPress={submitForgotOnEnter}
            fullWidth
            margin='normal'
            label='email'
            variant='outlined'
            error={forgotError}
            helperText={forgotError ? 'Wrong email!' : null}
          />
          <Button
            color='primary'
            variant='contained'
            fullWidth
            onClick={onSubmitPwdReset}
          >
            Send
            </Button>
        </Collapse>

      </Paper>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  _snackbar: (text, color, time) => dispatch(addSnackbarActionCreator(text, color, time)),
  _logIn: (email, pwd) => dispatch(logInAsyncActionCreator(email, pwd)),
  _resetPwd: email => dispatch(resetPasswordAsyncActionCreator(email))
})

export default connect(
  null,
  mapDispatchToProps
)(LogInForm)