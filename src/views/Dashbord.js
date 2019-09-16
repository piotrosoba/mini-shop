import React from 'react'

import { Typography, Link } from '@material-ui/core'

const Dashbord = props => {
  return (
    <div>
      <Typography
        variant='h2'
        align='center'
      >
        Mini Shop
      </Typography>
      <Typography
        variant='h5'
        align='center'
      >
        I've made this application to show my frontend skills.
        <br />
        Used technologies: React, Redux. Firebase, Axios, Material-UI.
        <br />
        More about me: <Link href='https://piotrosoba.github.io' target='_blank'>portfolio</Link>
      </Typography>
    </div>
  )
}

export default Dashbord