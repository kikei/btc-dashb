export class loginConstants {
  static SET_USERNAME = "LOGIN_CHANGE_USERNAME"
  static SET_PASSWORD = "LOGIN_CHANGE_PASSWORD"
  static REQUEST_LOGIN = "LOGIN_REQUEST_LOGIN"
}

const initialFlagsState = {
  editUsername: '',
  editPassword: ''
}

export function loginReducer(state=initialFlagsState, action) {
  console.log('loginReducer', state, action)
  const { type, payload } = action
  if (type == loginConstants.SET_USERNAME) {
    return Object.assign({}, state, {
      editUsername: payload
    })
  } else if (type == loginConstants.SET_PASSWORD) {
    return Object.assign({}, state, {
      editPassword: payload
    })
  }
  return state
}
