import axios from 'axios'
import { REGISTER_URL } from '../consts/firebase'

export const registerUserAsyncActionCreator = (email, pwd) => (dispatch, getState) => {
  axios.post(REGISTER_URL, {
    email,
    pwd,
  })
    .then(console.log)
}

const initialState = {

}

export default (state = initialState, action) => {
  switch (action.type) {

    default:
      return state
  }
}

registerUserAsyncActionCreator('dasda@dsdas.pl', '123')()