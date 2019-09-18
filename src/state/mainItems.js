import { fetchWithTokenAndProgress } from './auth'
import { mapObjectToArray } from '../utilities/mapObjectToArray'
import { URL } from '../consts/firebase'

const GET = 'mainItems/GET'
const ERROR = 'mainItems/ERROR'

export const getMainItemsAsyncActionCreator = () => dispatch => {
  return dispatch(fetchWithTokenAndProgress(URL + 'main-items.json'))
    .then(r => {
      const mappedData = mapObjectToArray(r.data)
      dispatch(saveItemsActionCreator(mappedData))
      return r
    })
    .catch(r => {
      dispatch(errorItemsActionCreator())
      return r
    })
}

const saveItemsActionCreator = items => ({
  type: GET,
  items
})

const errorItemsActionCreator = () => ({ type: ERROR })

const initialState = {
  data: [],
  isError: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET:
      return {
        ...state,
        data: action.items,
        isError: false
      }
    case ERROR:
      return {
        ...state,
        isError: true
      }
    default:
      return state
  }
}