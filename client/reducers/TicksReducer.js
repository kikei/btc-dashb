export class ticksConstants {
  static SET_TICKS = 'TICKS_SET_TICKS'
}

const initialState = {
  exchangers: {}
}

export function ticksReducer(state=initialState, action) {
  console.log('ticksReducer', state, action)
  const { type, payload } = action
  if (type == ticksConstants.SET_TICKS) {
    const ticks = Object.assign({}, payload.exchangers)
    return Object.assign({}, state, {
      exchangers: ticks
    })
  }
  return Object.assign({}, state)
}
