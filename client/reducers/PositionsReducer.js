export class positionsConstants {
  static SET_POSITIONS = 'POSITIONS_SET_POSITIONS'
  static SET_POSITIONS_LOADING ='POSITIONS_SET_POSITIONS_LOADING'
}

const initialState = {
  positions: [],
  positionsLoading: true
}

export function positionsReducer(state=initialState, action) {
  console.log('positionsReducer', state, action)
  const { type, payload } = action
  if (type == positionsConstants.SET_POSITIONS) {
    const positions = payload.positions.concat()
    return Object.assign({}, state, {
      positions: positions,
      positionsLoading: false
    })
  } else if (type == positionsConstants.SET_POSITIONS_LOADING) {
    return Object.assign({}, state, {
      positionsLoading: payload
    })
  }
  return state
}
