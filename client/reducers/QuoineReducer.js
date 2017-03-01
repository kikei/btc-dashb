export class quoineConstants {
  static SET_EXCHANGER = 'QUOINE_SET_EXCHANGER'
}

const initialState = {
  net_asset: 0,
  free_margin: 0,
  required_margin: 0,
  keep_rate: 0,
  tick: {
    ask: 0,
    bid: 0,
    datetime: ''
  },
  positions: [],
  accountLoading: true,
  positionsLoading: true
}

export function quoineReducer(state=initialState, action) {
  console.log('quoineReducer', state, action)
  const { type, payload } = action
  if (type == quoineConstants.SET_EXCHANGER) {
    return Object.assign({}, state, {
      net_asset: payload.net_asset,
      free_margin: payload.free_margin,
      required_margin: payload.required_margin,
      keep_rate: payload.keep_rate,
      tick: {
        ask: payload.tick.ask,
        bid: payload.tick.bid,
        datetime: payload.tick.datetime
      },
      positions: payload.positions.concat(),
      accountLoading: false,
      positionsLoading: false
    })
  }
  return state
}
