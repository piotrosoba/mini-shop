import React from 'react'

import { connect } from 'react-redux'
import { getMainItemsAsyncActionCreator } from '../state/mainItems'

import { Typography, Button } from '@material-ui/core'

import ItemsList from '../components/ItemsList'
import SingleItem from './SingleItem'

class MainItems extends React.Component {
  state = {

  }

  componentDidMount() {
    if (this.props._data.length === 0) this.props._getData()
  }

  render() {
    if (this.props._isError)
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            align='center'
            variant='h3'
            color='error'
            gutterBottom
          >
            Download data from database failed!
          <br />
            Try again later.
        </Typography>
          <Button
            color='primary'
            size='large'
            onClick={this.props._getData}
          >
            Refresh
        </Button>
        </div>
      )

    if (this.props.match.params.id && this.props._data.length) {
      const item = this.props._data.filter(item => item.key === this.props.match.params.id)[0]
      return <SingleItem
        item={item}
        id={this.props.match.params.id}
        route='/shop/'
        back={() => this.props.history.push('/shop')}
        goToBasket={() => this.props.history.push('/basket')}
      />
    }

    return (
      <div>
        <ItemsList
          data={this.props._data}
          history={this.props.history}
          route='/shop/'
        />
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