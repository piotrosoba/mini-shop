const ADD_FS_CIRCURAL = "fullScreenCircural/ADD"
const REMOVE_FS_CIRCURAL = "fullScreenCircural/REMOVE"

const addProgressActionCreator = () => ({
  type: ADD_FS_CIRCURAL,
  time: Date.now()
})
const removeProgressActionCreator = () => ({ type: REMOVE_FS_CIRCURAL })

export const fullScreenCircural = {
  add: addProgressActionCreator,
  remove: removeProgressActionCreator
}

const initialState = {
  fetchs: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_FS_CIRCURAL:
      return {
        ...state,
        fetchs: [...state.fetchs, action.time]
      }
    case REMOVE_FS_CIRCURAL:
      return {
        ...state,
        fetchs: state.fetchs.filter((fetch, index) => index !== 0)
      }
    default:
      return state
  }
}