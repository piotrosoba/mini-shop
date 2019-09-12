import React, { useState } from 'react'

import { Paper, TextField, Button, Typography, CircularProgress } from '@material-ui/core'

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 },
  paper: { maxWidth: 320, padding: 20 },
  buttons: { display: 'flex', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' },
  button: { marginBottom: 10 },
  circural: { display: 'flex', justifyContent: 'center', width: 80 }
}

const LogInForm = props => {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
  const [circural, setCircural] = useState(false)
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
          fullWidth
          margin='normal'
          label='email'
          variant='outlined'
        />
        <TextField
          value={pwd}
          onChange={(evt) => setPwd(evt.target.value)}
          fullWidth
          margin='normal'
          label='password'
          variant='outlined'
          type='password'
        />
        <div style={styles.buttons}>
          <Button
            style={styles.button}
            color='primary'
            variant='contained'
            onClick={() => setCircural(!circural)}
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
          >
            Register
          </Button>
          <Button
            style={{ marginLeft: 'auto', marginRight: 'auto' }}
          >
            forgot password?
        </Button>
        </div>
      </Paper>
    </div>
  )
}

export default LogInForm