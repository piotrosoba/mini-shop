import React, { useState } from 'react'

import { connect } from 'react-redux'

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

  const emailValidate = (string = email) => setEmailError(!string.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
  const pwdValidate = (string = pwd) => setPwdError(string.length < 8)
  const pwd2Validate = (string = pwd2) => setPwd2Error(pwd !== string)

  const signInEnable = !!email && !!pwd && !!pwd2 && !emailError && !pwdError && !pwd2Error && pwd2 === pwd

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
            onClick={() => {
            }}
            margin='normal'
            disabled={!signInEnable}
          >
            Sign in
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
            Back
          </Button>
        </div>
      </Paper>
    </div>
  )
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterForm)