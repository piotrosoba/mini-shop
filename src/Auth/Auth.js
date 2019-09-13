import React from 'react'

import { connect } from 'react-redux'

import LogInForm from './LogInForm'
import RegisterForm from './RegisterForm'

class Auth extends React.Component {
  state = {
    form: true
  }

  toggleForm = () => {
    this.setState({ form: !this.state.form })
  }

  render() {
    return (
      false ?
        this.props.children
        :
        this.state.form ?
          <LogInForm
            toggleForm={this.toggleForm}
          />
          :
          <RegisterForm
            toggleForm={this.toggleForm}
          />
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth)