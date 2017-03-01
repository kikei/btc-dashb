export class conditionsConstants {
  static SET_CONDITIONS = 'CONDITIONS_SET_CONDITIONS'
  static SET_DIFF = 'CONDITION_SET_DIFF'
  static SET_LOTS = 'CONDITION_SET_LOTS'
  static SET_PROFIT = 'CONDITION_SET_PROFIT'
  static ADD_CONDITION = 'CONDTION_ADD_CONDITION'
  static DELETE_CONDITION = 'CONDITION_DELETE_CONDITION'
  static REQUEST_ADD_CONDITION = 'CONDITION_REQUEST_ADD_CONDITION'
  static REQUEST_DELETE_CONDITION = 'CONDITION_REQUEST_DELETE_CONDITION'
  static SET_CONDITIONS_LOADING = 'CONDITION_SET_CONDITIONS_LOADING'
}

const initialState = {
  conditions: [],
  editDiff: '',
  editLots: '',
  editProfit: '',
  conditionsLoading: true
}

export function conditionsReducer(state=initialState, action) {
  console.log('conditionsReducer', state, action)
  const { type, payload } = action
  if (type == conditionsConstants.SET_CONDITIONS) {
    const conditions = payload.concat()
    return Object.assign({}, state, {
      conditions: conditions,
      conditionsLoading: false
    })
  } else if (type == conditionsConstants.SET_DIFF) {
    return Object.assign({}, state, {
      editDiff: payload
    })
  } else if (type == conditionsConstants.SET_LOTS) {
    return Object.assign({}, state, {
      editLots: payload
    })
  } else if (type == conditionsConstants.SET_PROFIT) {
    return Object.assign({}, state, {
      editProfit: payload
    })
  } else if (type == conditionsConstants.ADD_CONDITION) {
    const conditions = state.conditions.concat()
    const idx = conditions.findIndex((e, i) => e.diff == payload.diff )
    if (idx >= 0) {
      conditions[idx] = payload
    } else {
      conditions.push(payload)
      conditions.sort((a, b) => a.diff - b.diff )
    }
    return Object.assign({}, state, {
      conditions: conditions
    })
  } else if (type == conditionsConstants.DELETE_CONDITION) {
    const conditions = state.conditions.concat()
    const diff = payload
    return Object.assign({}, state, {
      conditions: conditions.filter((e, i) => e.diff != diff)
    })
  } else if (type == conditionsConstants.SET_CONDITIONS_LOADING) {
    return Object.assign({}, state, {
      conditionsLoading: payload
    })
  }
  return state
}
