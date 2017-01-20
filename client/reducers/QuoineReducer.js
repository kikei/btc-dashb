export class quoineConstants {
  static SET_EXCHANGER = 'QUOINE_SET_EXCHANGER'
}

const initialState = {
  net_asset: 0,
  tick: {
    ask: 0,
    bid: 0,
    datetime: ''
  },
  positions: [],
}

export function quoineReducer(state=initialState, action) {
  console.log('quoineReducer', state, action)
  const { type, payload } = action
  if (type == quoineConstants.SET_EXCHANGER) {
    return Object.assign({}, state, {
      net_asset: payload.net_asset,
      tick: {
        ask: payload.tick.ask,
        bid: payload.tick.bid,
        tick: payload.tick.datetime
      },
      positions: payload.positions.concat()
    })
  }
  return state
}
