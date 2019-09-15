import axios from 'axios'
import jwt from 'jsonwebtoken'
import { fullScreenCircural } from './fullScreenCircural'
import { addSnackbarActionCreator } from './snackbars'

import { REGISTER_URL, LOG_IN_URL, RESET_PASSWORD, REFRESH_TOKEN_URL } from '../consts/firebase'

const SAVE_DECODED_TOKEN = 'auth/SAVE_DECODED_TOKEN'
const LOG_OUT = 'auth/LOG_OUT'

export const fetchWithTokenAndProgress = (url, method = 'get', data = {}) => (dispatch) => {
  dispatch(fullScreenCircural.add())
  return dispatch(fetchWithToken(url, method = 'get', data = {}))
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
      if (r.response.statusText === 'Unauthorized') { }
      return dispatch(useRefreshToken(refreshToken))
        .catch(() => {
          dispatch(logOut())
          dispatch(addSnackbarActionCreator('Your session expired, log in again', 'red'))
          return Promise.reject(r)
        })
        .then(() => axios({
          url: getUrlWithToken(),
          method,
          data
        }))
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
        dispatch(saveAndDecodeToken(idToken, refreshToken))
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
        dispatch(saveAndDecodeToken(idToken, refreshToken))
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

export const checkIsUserLoggedIn = () => (dispatch) => {
  const idToken = localStorage.getItem('idToken')
  const refreshToken = localStorage.getItem('refreshToken')

  const expires = idToken ? jwt.decode(idToken).exp * 1000 : 0
  if (Date.now() < expires && refreshToken) {
    dispatch(saveAndDecodeToken(idToken, refreshToken))
  } else if (refreshToken) {
    dispatch(fullScreenCircural.add())
    dispatch(useRefreshToken(refreshToken))
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
        dispatch(saveAndDecodeToken(response.data.id_token, response.data.refresh_token))
      return response
    })
}

export const logOut = () => dispatch => {
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('idToken')
  dispatch(logOutActionCreator())
}

const logOutActionCreator = () => ({ type: LOG_OUT })

const saveAndDecodeToken = (idToken, refreshToken) => (dispatch) => {
  localStorage.setItem('idToken', idToken)
  localStorage.setItem('refreshToken', refreshToken)
  dispatch(saveDecodedTokenActionCreator(jwt.decode(idToken), idToken, refreshToken))
}

const saveDecodedTokenActionCreator = (decodedToken, idToken, refreshToken) => ({
  type: SAVE_DECODED_TOKEN,
  decodedToken,
  idToken,
  refreshToken
})

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
        isLogged: true,
        idToken: action.idToken,
        refreshToken: action.refreshToken,
        ...action.decodedToken
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

