import React from 'react'

import { connect } from 'react-redux'

import LogInForm from './LogInForm'

class Auth extends React.Component {
  state = {

  }

  render() {
    return (
      false ?
        this.props.children
        :
        <LogInForm />
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)