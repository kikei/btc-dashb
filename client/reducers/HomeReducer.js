export class homeConstants {
  static CHANGE_FLAG = 'CHANGE_FLAG'
  static REQUEST_CHANGE_FLAG = 'HOME_REQUEST_CHANGE_FLAG'
  static FETCH_ASSETS = 'HOME_FETCH_ASSETS'
}

const initialFlagsState = {
  flags: {
    onoff: false
  },
  assets: {
    exchangers: {
      bitflyer: {
        net_asset: 0
      },
      quoine: {
        net_asset: 0
      }
    },
    total: {
      net_asset: 0
    }
  },
  assetsLoading: true,
  flagsLoading: true
}

export function homeReducer(state=initialFlagsState, action) {
  console.log('flagsReducer', state, action)
  const { type, payload } = action
  if (type == homeConstants.CHANGE_FLAG) {
    const { key, value } = payload
    const flags = {}
    flags[key] = value
    return Object.assign({}, state, {
      flags: Object.assign({}, state.flags, flags),
      flagsLoading: false
    })
  } else if (type == homeConstants.FETCH_ASSETS) {
    const assets = Object.assign({}, payload)
    return Object.assign({}, state, {
      assets: assets,
      assetsLoading: false
    })
  }
  return state
}
