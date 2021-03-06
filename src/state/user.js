import { URL } from '../consts/firebase'
import { fetchWithToken, fetchWithTokenAndProgress } from './auth'
import { addSnackbarActionCreator } from './snackbars'

const SAVE_USER = 'user/SAVE_USER'

export const addToBasketAsyncActionCreator = item => (dispatch, getState) => {
  return dispatch(getUserFromBaseAsyncActionCreator())
    .then((r) => {
      const stateUser = getState().user
      let basket = stateUser.basket
      if (basket && Array.isArray(basket)) {
        const isAlreadyInBasketIndex = basket.findIndex(el => el && el.key === item.key)
        if (isAlreadyInBasketIndex === -1) {
          basket = [...basket, item]
        } else
          basket[isAlreadyInBasketIndex].quantity += item.quantity
      } else {
        basket = [item]
      }
      return dispatch(saveUserAcyncActionCreator({ ...stateUser, basket }))
    })
    .catch((r) => {
      dispatch(addSnackbarActionCreator('Something went wrong, try again later', 'red'))
      return r
    })
}

export const saveItemAsyncActionCreator = data => (dispatch, getState) => {
  const userId = getState().auth.user_id
  return dispatch(fetchWithTokenAndProgress(URL + 'users/' + userId + '/ownShop.json', 'post', data))
}

export const removeItemAsyncActionCreator = (key) => (dispatch, getState) => {
  const userId = getState().auth.user_id
  return dispatch(fetchWithTokenAndProgress(URL + 'users/' + userId + '/ownShop/' + key + '.json', 'delete'))
}

export const editItemAsyncActionCreator = (item, key) => (dispatch, getState) => {
  const userId = getState().auth.user_id
  return dispatch(fetchWithTokenAndProgress(URL + 'users/' + userId + '/ownShop/' + key + '.json', 'patch', item))
}

export const getUserFromBaseAsyncActionCreator = () => (dispatch, getState) => {
  const userId = getState().auth.user_id
  if (userId)
    return dispatch(fetchWithToken(URL + 'users/' + userId + '.json'))
      .then(r => {
        dispatch(saveUserActionCreator(r.data))
        return r
      })
}

export const saveUserAcyncActionCreator = (user, dontWaitOnResolve) => (dispatch, getState) => {
  const oldUser = getState().user
  const stateAuth = getState().auth
  const userId = stateAuth.user_id
  const userEmail = stateAuth.email
  if (!user) {
    user = {
      userId,
      userEmail,
      wallet: Number((100).toFixed(2))
    }
  }
  if (userId) {
    if (dontWaitOnResolve === true)
      dispatch(saveUserActionCreator(user))
    return dispatch(fetchWithToken(URL + 'users/' + userId + '.json', 'patch', user))
      .then(r => {
        if (dontWaitOnResolve !== true)
          dispatch(saveUserActionCreator(user))
        return r
      })
      .catch(r => {
        dispatch(saveUserActionCreator(oldUser))
        return Promise.reject(r)
      })
  }
}

export const updateWalletActionCreator = (cash) => (dispatch, getState) => {
  const stateUser = getState().user
  const userId = stateUser.userId
  const actuallWallet = stateUser.wallet
  const cashUpdate = cash > 100 ? 100 : cash
  const newBalance = Number((Number(actuallWallet) + Number(cashUpdate)).toFixed(2))

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