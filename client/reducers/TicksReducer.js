export class ticksConstants {
  static SET_TICKS = 'TICKS_SET_TICKS'
  static SET_TICKS_LOADING = 'TICKS_SET_TICKS_LOADING'
}

const initialState = {
  exchangers: {},
  ticksLoading: true
}

export function ticksReducer(state=initialState, action) {
  console.log('ticksReducer', state, action)
  const { type, payload } = action
  if (type == ticksConstants.SET_TICKS) {
    const ticks = Object.assign({}, payload.exchangers)
    return Object.assign({}, state, {
      exchangers: ticks,
      ticksLoading: false
    })
  } else if (type == ticksConstants.SET_TICKS_LOADING) {
    return Object.assign({}, state, {
      ticksLoading: payload
    })
  }
  return Object.assign({}, state)
}
