export class positionsConstants {
  static SET_POSITIONS = 'POSITIONS_SET_POSITIONS'
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
  }
  return state
}
