import axios from 'axios'
import jwt from 'jsonwebtoken'

import { REGISTER_URL, LOG_IN_URL, RESET_PASSWORD } from '../consts/firebase'

const SAVE_DECODED_TOKEN = 'auth/SAVE_DECODED_TOKEN'

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

const saveAndDecodeToken = (idToken, refreshToken) => (dispatch) => {
  localStorage.setItem('idToken', idToken)
  localStorage.setItem('refreshToken', refreshToken)
  dispatch(saveDecodedTokenActionCreator(jwt.decode(idToken)))
}

const saveDecodedTokenActionCreator = decodedToken => ({
  type: SAVE_DECODED_TOKEN,
  decodedToken
})

const initialState = {
  isLogged: false,
  user_id: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SAVE_DECODED_TOKEN:
      return {
        ...state,
        isLogged: true,
        ...action.decodedToken
      }
    default:
      return state
  }
}

