const ADD = 'snackbars/ADD'
const REMOVE = 'snackbars/REMOVE'

export const addSnackbarActionCreator = (text, color) => (dispatch, getState) => {
  const key = Math.random().toString(16).slice(7)
  dispatch(addActionCreator(text, color, key))
  setTimeout(() => dispatch(removeActionCreator(key)), 3000)
}

const removeActionCreator = key => ({
  type: REMOVE,
  key
})

const addActionCreator = (text, color, key) => ({
  type: ADD,
  text,
  color,
  key
})

const initialState = {
  bars: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        bars: [
          {
            text: action.text,
            color: action.color,
            key: action.key
          },
          ...state.bars
        ]
      }
    case REMOVE:
      return {
        ...state,
        bars: state.bars.filter(snackbar => snackbar.key !== action.key)
      }
    default:
      return state
  }
}