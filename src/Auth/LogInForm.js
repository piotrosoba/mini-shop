import React, { useState } from 'react'

import { connect } from 'react-redux'
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
  const [forgotEmail, setForgotEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [forgotPanel, toggleForgot] = useState(false)
  const [errors, setErrors] = useState({
    email: false,
    pwd: false
  })
  const [forgotError, setForgotError] = useState(false)

  const validate = () => {
    setErrors({
      email: !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
      pwd: !pwd
    })
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
        <TextField
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          onBlur={errors.email ? validate : null}
          fullWidth
          margin='normal'
          label='email'
          variant='outlined'
          error={errors.email}
          helperText={errors.email ? 'Wrong email!' : null}
        />
        <TextField
          value={pwd}
          onChange={(evt) => setPwd(evt.target.value)}
          onBlur={errors.pwd ? validate : null}
          fullWidth
          margin='normal'
          label='password'
          variant='outlined'
          type='password'
          error={errors.pwd}
        />
        <div style={styles.buttons}>
          <Button
            style={styles.button}
            color='primary'
            variant='contained'
            onClick={() => {
              validate()
            }}
            margin='normal'
          >
            Log In
          </Button>
          <div style={styles.circural}>
            {false ? <CircularProgress /> : null}
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
            onChange={(evt) => setForgotEmail(evt.target.value)}
            onFocus={() => setForgotError(false)}
            onBlur={() => setForgotError(!forgotEmail.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))}
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
            onClick={() => {
              if (!forgotEmail)
                setForgotError(true)

              if (!forgotError && forgotEmail) {
                props._snackbar('Check your email!')
                toggleForgot(false)
              }
            }}
          >
            Send
            </Button>
        </Collapse>

      </Paper>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  _snackbar: (text, color, time) => dispatch(addSnackbarActionCreator(text, color, time))
})

export default connect(
  null,
  mapDispatchToProps
)(LogInForm)