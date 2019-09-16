import React from 'react'

import { Typography, Link } from '@material-ui/core'

const Dashbord = props => {
  return (
    <div>
      <Typography
        style={{ marginTop: 30 }}
        variant='h2'
        align='center'
      >
        <b>Mini Shop</b>
      </Typography>
      <Typography
        variant='h5'
        align='center'
      >
        <br />
        I've made this application to show my frontend skills.
        <br />
        <br />
        Used technologies: React, Redux, Firebase, Axios, Material-UI.
        <br />
        <br />
        About:
      </Typography>
      <Typography
        style={{ maxWidth: 640, margin: '0 auto' }}
        align='center'
        variant='h5'
      >
        <p>Authentication is made with Firebase App. Data to auto login is saving in local storage.</p>
        <p>To everyone request is added ID token(in parameter), wchich has expire time: 1 hour. If this token expired, it will be refreshed
        automatically by refresh token.</p>
        <p>Everyone (your wallet, basket, items) are saved in database.</p>
        <p>This app maybe doesn't look beautiful (because I'm not UX) but works quite well.</p>
        <p>I decided to let you save new items on your own list only. I did that because I don't wanna have troll items on main list.</p>
      </Typography>
      <br />
      <Typography
        variant='h5'
        align='center'
      >
        Source: <Link href='https://github.com/piotrosoba/mini-shop' target='_blank'>GitHub</Link>
      </Typography>
      <Typography
        variant='h5'
        align='center'
      >
        More about me: <Link href='https://piotrosoba.github.io' target='_blank'>portfolio</Link>
      </Typography>
    </div>
  )
}

export default Dashbord