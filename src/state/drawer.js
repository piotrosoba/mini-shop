const DRAWER_OPEN = 'DRAWER/OPEN'
const DRAWER_CLOSE = "DRAWER/CLOSE"

export const drawerOpenActionCreator = () => ({ type: DRAWER_OPEN })
export const drawerCloseActionCreator = () => ({ type: DRAWER_CLOSE })

const initialState = {
  open: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case DRAWER_OPEN:
      return {
        ...state,
        open: true
      }
    case DRAWER_CLOSE:
      return {
        ...state,
        open: false
      }
    default:
      return state
  }
}