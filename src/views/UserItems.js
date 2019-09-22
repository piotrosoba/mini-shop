import React from 'react'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { getUserFromBaseAsyncActionCreator, removeItemAsyncActionCreator } from '../state/user'
import { addSnackbarActionCreator } from '../state/snackbars'
import { fullScreenCircural } from '../state/fullScreenCircural'

import { mapObjectToArray } from '../utilities/mapObjectToArray'

import ItemsList from '../components/ItemsList'
import SingleItem from './SingleItem'
import { Typography } from '@material-ui/core'

class UserItems extends React.Component {
  componentDidMount() {
    this.getUser()
  }

  getUser = () => {
    this.props._startCircular()
    return this.props._getUser()
      .finally(r => {
        this.props._endCircural()
        return r
      })
  }

  removeItem = (key) => {
    this.props._startCircular()
    this.props._removeItem(key)
      .then(r => {
        this.getUser()
          .then(r => {
            this.props._snackbar('Removed', 'green', 5000)
            return r
          })
          .catch(r => r)
          .finally(() => this.props.history.push('/own-shop'))
        return r
      })
      .catch(r => {
        this.props._snackbar('Something went wrong, try again later!', 'red')
        return r
      })
      .finally(this.props._endCircural)
  }

  render() {
    if (this.props._data && this.props._data.length === 0) {
      return (
        <Typography
          variant='h4'
          align='center'
          style={{ marginTop: 20 }}
        >
          You haven't added any items yet.
          <br />
          Go<Link to='/add-item'> here </Link>and add some!
        </Typography>
      )
    }

    if (this.props.match.params.id && this.props._data.length) {
      const item = this.props._data.filter(item => item.key === this.props.match.params.id)[0]
      return <SingleItem
        item={item}
        id={this.props.match.params.id}
        back={() => this.props.history.push('/own-shop')}
        goToBasket={() => this.props.history.push('/basket')}
        removeAndEdit={true}
        remove={() => this.removeItem(item.key)}
      />
    }

    return (
      <div>
        <ItemsList
          data={this.props._data}
          history={this.props.history}
          to='/own-shop/'
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  _data: mapObjectToArray(state.user.ownShop)
})

const mapDispatchToProps = dispatch => ({
  _getUser: () => dispatch(getUserFromBaseAsyncActionCreator()),
  _startCircular: () => dispatch(fullScreenCircural.add()),
  _endCircural: () => dispatch(fullScreenCircural.remove()),
  _removeItem: (key) => dispatch(removeItemAsyncActionCreator(key)),
  _snackbar: (text, color) => dispatch(addSnackbarActionCreator(text, color))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserItems)