import { URL } from '../consts/firebase'
import { fetchWithToken, fetchWithTokenAndProgress } from './auth'
import { addSnackbarActionCreator } from './snackbars'

const SAVE_USER = 'user/SAVE_USER'

export const getUserFromBaseAsyncActionCreator = () => (dispatch, getState) => {
  const userId = getState().auth.user_id
  if (userId)
    return dispatch(fetchWithToken(URL + 'users/' + userId + '.json'))
      .then(r => {
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
    wallet: 100
  }
  if (userId)
    return dispatch(fetchWithToken(URL + 'users/' + userId + '.json', 'patch', user))
      .then(() => dispatch(saveUserActionCreator(user)))
}

export const updateWalletActionCreator = (cash) => (dispatch, getState) => {
  const stateUser = getState().user
  const userId = stateUser.userId
  const actuallWallet = stateUser.wallet
  const cashUpdate = cash > 100 ? 100 : cash
  const newBalance = actuallWallet + cashUpdate

  return dispatch(fetchWithTokenAndProgress(URL + 'users/' + userId + '.json', 'patch', { wallet: newBalance }))
    .then(r => {
      dispatch(saveUserActionCreator({ ...stateUser, wallet: newBalance }))
      dispatch(addSnackbarActionCreator(`Your new balance: ${newBalance}$`))
      return r
    })
    .catch(r => {
      dispatch(addSnackbarActionCreator('Error! Try again later', 'red'))
      return r
    })
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
        ...action.user
      }
    default:
      return state
  }
}