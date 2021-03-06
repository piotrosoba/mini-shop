import axios from 'axios'
import jwt from 'jsonwebtoken'
import { fullScreenCircural } from './fullScreenCircural'
import { addSnackbarActionCreator } from './snackbars'
import { saveUserAcyncActionCreator, getUserFromBaseAsyncActionCreator } from './user'

import { REGISTER_URL, LOG_IN_URL, RESET_PASSWORD, REFRESH_TOKEN_URL, CHANGE_PASSWORD } from '../consts/firebase'

const SAVE_DECODED_TOKEN = 'auth/SAVE_DECODED_TOKEN'
const LOG_OUT = 'auth/LOG_OUT'
const LOG_IN = 'auth/LOG_IN'

export const fetchWithTokenAndProgress = (url, method = 'get', data = {}) => (dispatch) => {
  dispatch(fullScreenCircural.add())
  return dispatch(fetchWithToken(url, method, data))
    .finally((r) => {
      dispatch(fullScreenCircural.remove())
      return r
    })
}

export const fetchWithToken = (url, method = 'get', data = {}) => (dispatch, getState) => {
  const getUrlWithToken = () => {
    const auth = getState().auth
    if (auth.idToken)
      return url.includes('?') ? url + '&auth=' + auth.idToken : url + '?auth=' + auth.idToken

    return url
  }

  return axios({
    url: getUrlWithToken(),
    method,
    data
  })
    .catch(r => {
      const refreshToken = getState().auth.refreshToken || localStorage.getItem('refreshToken')
      if (r.response && r.response.statusText === 'Unauthorized') {
        return dispatch(useRefreshToken(refreshToken))
          .catch(() => {
            dispatch(logOutActionCreator())
            dispatch(addSnackbarActionCreator('Your session expired, log in again', 'red'))
            return Promise.reject(r)
          })
          .then(() => axios({
            url: getUrlWithToken(),
            method,
            data
          }))
      } else {
        return Promise.reject(r)
      }
    })
}

export const registerUserAsyncActionCreator = (email, password) => (dispatch) => {
  return axios({
    method: 'post',
    url: REGISTER_URL,
    data: {
      email,
      password
    }
  })
    .then(response => {
      if (response && response.data) {
        const idToken = response.data.idToken
        const refreshToken = response.data.refreshToken
        dispatch(saveAndDecodeTokenActionCreator(idToken, refreshToken))
        dispatch(saveUserAcyncActionCreator())
        dispatch(logInActionCreator())
      }
      return response
    })
}

export const logInAsyncActionCreator = (email, password) => (dispatch) => {
  return axios({
    method: 'post',
    url: LOG_IN_URL,
    data: {
      email,
      password,
      returnSecureToken: true
    }
  })
    .then(response => {
      if (response && response.data) {
        const idToken = response.data.idToken
        const refreshToken = response.data.refreshToken
        dispatch(saveAndDecodeTokenActionCreator(idToken, refreshToken))
        dispatch(getUserFromBaseAsyncActionCreator())
          .then(() => dispatch(logInActionCreator()))
      }
      return response
    })
}

export const resetPasswordAsyncActionCreator = email => dispatch => {
  return axios({
    method: 'post',
    url: RESET_PASSWORD,
    data: {
      email,
      requestType: 'PASSWORD_RESET'
    }
  })
}

export const changePasswordAsyncActionCreator = (oldPassword, newPassword) => (dispatch, getState) => {
  const authState = getState().auth
  const email = authState.email
  const idToken = authState.idToken

  dispatch(fullScreenCircural.add())
  return axios({
    method: 'post',
    url: LOG_IN_URL,
    data: {
      email,
      password: oldPassword
    }
  })
    .then(() => {
      dispatch(fullScreenCircural.add())
      return axios({
        method: 'post',
        url: CHANGE_PASSWORD,
        data: {
          idToken,
          password: newPassword,
          returnSecureToken: true
        }
      })
        .then(r => {
          dispatch(saveAndDecodeTokenActionCreator(r.data.idToken, r.data.refreshToken))
          dispatch(addSnackbarActionCreator('Password changed succesfuly'))
        })
        .catch(() => dispatch(addSnackbarActionCreator('Something went wrong, try again later!', 'red')))
        .finally(() => dispatch(fullScreenCircural.remove()))
    })
    .catch((r) => {
      let message = 'Something went wrong, try again later!'
      if (r.response && r.response.data.error && r.response.data.error.message === 'INVALID_PASSWORD')
        message = 'Invalid old password'
      dispatch(addSnackbarActionCreator(message, 'red'))
      return r
    })
    .finally(() => dispatch(fullScreenCircural.remove()))
}

export const checkIsUserLoggedIn = () => (dispatch) => {
  const idToken = localStorage.getItem('idToken')
  const refreshToken = localStorage.getItem('refreshToken')

  const expires = idToken ? jwt.decode(idToken).exp * 1000 : 0
  if (Date.now() < expires && refreshToken) {
    dispatch(saveAndDecodeTokenActionCreator(idToken, refreshToken))
    dispatch(fullScreenCircural.add())
    dispatch(getUserFromBaseAsyncActionCreator())
      .then(() => dispatch(logInActionCreator()))
      .finally(() => dispatch(fullScreenCircural.remove()))
  } else if (refreshToken) {
    dispatch(fullScreenCircural.add())
    dispatch(useRefreshToken(refreshToken))
      .then(() => {
        dispatch(fullScreenCircural.add())
        dispatch(getUserFromBaseAsyncActionCreator())
          .then(() => dispatch(logInActionCreator()))
          .finally(() => dispatch(fullScreenCircural.remove()))

      })
      .finally(() => dispatch(fullScreenCircural.remove()))
  }
}

const useRefreshToken = refreshToken => dispatch => {
  return axios({
    method: 'post',
    url: REFRESH_TOKEN_URL,
    data: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }
  })
    .then(response => {
      if (response.data)
        dispatch(saveAndDecodeTokenActionCreator(response.data.id_token, response.data.refresh_token))
      return response
    })
}

export const logOutActionCreator = () => {
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('idToken')
  return { type: LOG_OUT }
}

const logInActionCreator = () => ({ type: LOG_IN })

const saveAndDecodeTokenActionCreator = (idToken, refreshToken) => {
  localStorage.setItem('idToken', idToken)
  localStorage.setItem('refreshToken', refreshToken)
  const decodedToken = jwt.decode(idToken)
  return {
    type: SAVE_DECODED_TOKEN,
    decodedToken,
    idToken,
    refreshToken
  }
}

const initialState = {
  isLogged: false,
  user_id: null,
  idToken: null,
  refreshToken: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DECODED_TOKEN:
      return {
        ...state,
        idToken: action.idToken,
        refreshToken: action.refreshToken,
        ...action.decodedToken
      }
    case LOG_IN:
      return {
        ...state,
        isLogged: true
      }
    case LOG_OUT: {
      return {
        ...state,
        isLogged: false
      }
    }
    // case 'brokeToken':
    //   return {
    //     ...state,
    //     idToken: null,
    //     refreshToken: null
    //   }
    default:
      return state
  }
}

