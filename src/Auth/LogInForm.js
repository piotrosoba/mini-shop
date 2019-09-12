import React, { useState } from 'react'

import { Paper, TextField, Button, Typography } from '@material-ui/core'

const styles = {
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 },
  paper: { maxWidth: 320, padding: 20 },
  buttons: { display: 'flex', justifyContent: 'space-around', alignItems: 'center' }
}

const LogInForm = props => {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')
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
            color='primary'
            variant='contained'
            onClick={() => console.log(email, pwd)}
          >
            Log In
          </Button>
          <Button
            color='secondary'
            variant='contained'
          >
            Register
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default LogInForm