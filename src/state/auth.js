import axios from 'axios'
import jwt from 'jsonwebtoken'

import { REGISTER_URL } from '../consts/firebase'

const SAVE_DECODED_TOKEN = 'auth/SAVE_DECODED_TOKEN'

export const registerUserAsyncActionCreator = (email, password) => (dispatch, getState) => {
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

const saveAndDecodeToken = (idToken, refreshToken) => (dispatch) => {
  localStorage.setItem('idToken', idToken)
  localStorage.setItem('refreshToken', refreshToken)
  dispatch(saveDecodedTokenActionCreator(jwt.decode(idToken)))
  console.log(jwt.decode(idToken))
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

