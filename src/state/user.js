import { URL } from '../consts/firebase'
import { fetchWithToken } from './auth'

const SAVE_USER = 'user/SAVE_USER'

export const getUserFromBaseAsyncActionCreator = () => (dispatch, getState) => {
  const userId = getState().auth.user_id
  if (userId)
    return dispatch(fetchWithToken(URL + 'users/' + userId + '.json'))
      .then(r => {
        console.log(r.data)
        dispatch(saveUserActionCreator(r.data))
        return r
      })
}

export const saveUserAcyncActionCreator = () => (dispatch, getState) => {
  const stateAuth = getState().auth
  const userId = stateAuth.user_id
  const userEmail = stateAuth.email
  const user = {
    userId,
    userEmail,
    basket: [],
    items: [],
    wallet: 100
  }
  if (userId)
    return dispatch(fetchWithToken(URL + 'users/' + userId + '.json', 'patch', user))
      .then(() => dispatch(saveUserActionCreator(user)))
}

const saveUserActionCreator = user => ({
  type: SAVE_USER,
  user
})

const initialState = {

}

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER:
      return {
        ...state,
        ...action.user
      }
    default:
      return state
  }
}