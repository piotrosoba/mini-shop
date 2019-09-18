import React from 'react'

import { connect } from 'react-redux'
import { getMainItemsAsyncActionCreator } from '../state/mainItems'

class MainItems extends React.Component {
  state = {

  }

  componentDidMount() {
    this.props._getData()
  }

  render() {
    console.log(this.props._data, this.props._isError)
    return (
      <div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  _data: state.mainItems.data,
  _isError: state.mainItems.isError
})

const mapDispatchToProps = dispatch => ({
  _getData: () => dispatch(getMainItemsAsyncActionCreator())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainItems)