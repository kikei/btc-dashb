import React from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Router, Route, DefaultRoute, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, LOCATION_CHANGE } from 'react-router-redux'

/* Authentication */
import { GuestApp } from './components/GuestApp'
import LoggedInApp from './components/LoggedInApp'

/* Login */
import Login from './components/Login'
import { loginReducer, loginConstants } from './reducers/LoginReducer'

/* Home */
import Home from './components/Home'
import { homeReducer, homeConstants } from './reducers/HomeReducer'

/* Conditions */
import Conditions from './components/Conditions'
import { conditionsReducer, conditionsConstants } from './reducers/ConditionsReducer'

/* Ticks */
import Ticks from './components/Ticks'
import { ticksReducer, ticksConstants } from './reducers/TicksReducer'

/* Positions */
import Positions from './components/Positions'
import { positionsReducer, positionsConstants } from './reducers/PositionsReducer'

/* Exchagers */
import Quoine from './components/Quoine'
import { quoineReducer, quoineConstants } from './reducers/QuoineReducer'

const postLogin = ({ username, password }) => dispatch => {
  const body = {
    username: username,
    password: password
  }
  fetch('/auth', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(json => {
      console.log('login posted', json)
      if (json['access_token']) {
        dispatch({
          type: mainConstants.SET_ACCESS_TOKEN,
          payload: json['access_token']
        })
        store.dispatch(browserHistory.push('/'))
      } else {
        dispatch({
          type: loginConstants.SET_ERROR,
          payload: json['description']
        })
      }
    })
    .catch(error => {
      console.error('error in login', error)
    })
}

const doLogout = () => dispatch => {
  localStorage.setItem('access_token', null)
  setTimeout(() => {
    store.dispatch(browserHistory.push('/login'))
  }, 1000)
}

const fetchProtected = (token, url, data) => {
  const def = {
    headers: {
      'Authorization': 'JWT ' + token,
      'Content-Type': 'application/json'
    }
  }
  return fetch(url, Object.assign(def, data))
}

const refreshToken = token => dispatch => {
  fetchProtected(token, '/auth/refresh', {
    'method': 'POST'
  })
    .then(response => response.json())
    .then(json => {
      console.log('token refreshed', json)
      if (json['access_token']) {
        dispatch({
          type: mainConstants.SET_ACCESS_TOKEN,
          payload: json['access_token']
        })
      } else {
        dispatch(browserHistory.push('/login'))
      }
    })
    .catch(error => {
      console.error('error in authentication', error)
    })
}

const fetchFlags = token => dispatch => {
  dispatch({
    type: homeConstants.SET_FLAGS_LOADING,
    payload: true
  })
  fetchProtected(token, '/api/flags')
    .then(response => response.json())
    .then(json => {
      console.log('flags fetched', json)
      Object.keys(json).forEach(key => {
        dispatch({
          type: homeConstants.CHANGE_FLAG,
          payload: { key: key, value: json[key] }
        })
      })
    })
    .catch(error => {
      console.log('error in fetching flags', error)
    })
}

const fetchAssets = token => dispatch => {
  dispatch({
    type: homeConstants.SET_ASSETS_LOADING,
    payload: true
  })
  fetchProtected(token, '/api/assets')
    .then(response => response.json())
    .then(json => {
      console.log('assets fetched', json)
      Object.keys(json).forEach(key => {
        dispatch({
          type: homeConstants.FETCH_ASSETS,
          payload: json
        })
      })
    })
    .catch(error => {
      console.log('error in fetching assets', error)
    })
}

const fetchConditions = token => dispatch => {
  dispatch({
    type: conditionsConstants.SET_CONDITIONS_LOADING,
    payload: true
  })
  fetchProtected(token, '/api/conditions')
    .then(response => response.json())
    .then(json => {
      console.log('conditions fetched', json)
      dispatch({
        type: conditionsConstants.SET_CONDITIONS,
        payload: json.conditions
      })
    })
    .catch(error => {
      console.log('error in fetching conditions', error)
    })
}

const fetchTicks = token => dispatch => {
  dispatch({
    type: ticksConstants.SET_TICKS_LOADING,
    payload: true
  })
  fetchProtected(token, '/api/ticks')
    .then(response => response.json())
    .then(json => {
      console.log('ticks fetched', json)
      dispatch({
        type: ticksConstants.SET_TICKS,
        payload: json
      })
    })
    .catch(error => {
      console.log('error in fetching ticks', error)
    })
}

const fetchPositions = token => dispatch => {
  dispatch({
    type: positionsConstants.SET_POSITIONS_LOADING,
    payload: true
  })
  fetchProtected(token, '/api/positions')
    .then(response => response.json())
    .then(json => {
      console.log('positions fetched', json)
      dispatch({
        type: positionsConstants.SET_POSITIONS,
        payload: json
      })
    })
    .catch(error => {
      console.error('error in fetching positions', error)
    })
}

const fetchQuoine = token => dispatch => {
  dispatch({
    type: quoineConstants.SET_ACCOUNT_LOADING,
    payload: true
  })
  dispatch({
    type: quoineConstants.SET_POSITIONS_LOADING,
    payload: true
  })
  fetchProtected(token, '/api/exchangers/quoine')
    .then(response => response.json())
    .then(json => {
      console.log('quoine fetched', json)
      dispatch({
        type: quoineConstants.SET_EXCHANGER,
        payload: json
      })
    })
    .catch(error => {
      console.error('error in fetching quoine', error)
    })
}

const postChangeFlag = (token, { key, value }) => dispatch => {
  const body = {
    value: value
  }
  fetchProtected(token, '/api/flags/' + key, {
    method: 'POST',
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(json => {
      console.log('flags posted', json)
      dispatch({
        type: homeConstants.CHANGE_FLAG,
        payload: { key: key, value: json[key] }
      })
    })
    .catch(error => {
      console.error('error in posting flag', error)
    })
}

const postCondition = (token, condition) => dispatch => {
  const body = {
    diff: condition.diff,
    lots: condition.lots,
    profit: condition.profit
  }
  fetchProtected(token, '/api/conditions', {
    method: 'POST', 
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .then(json => {
      console.log('condition posted', json)
      dispatch({
        type: conditionsConstants.ADD_CONDITION,
        payload: json.condition
      })
    })
    .catch(error => {
      console.log('error in posting condition', error)
    })
}

const deleteCondition = (token, diff) => dispatch => {
  fetchProtected(token, '/api/conditions/' + diff, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(json => {
      console.log('condition deleted', json)
      dispatch({
        type: conditionsConstants.DELETE_CONDITION,
        payload: json.diff
      })
    })
    .catch(error => {
      console.error('error in deleting condition', error)
    })
}

const requireToken = (store, dispatcher) => {
  /*
  const token = store.getState().token
  */
  const token = localStorage.getItem('access_token')
  console.log('token', token)
  if (!token) {
    store.dispatch(browserHistory.push('/login'))
  } else {
    dispatcher(token)
  }
}

const serverApiMiddleware = store => next => {
  return action => {
    if (!action) return;
    if (action.type == LOCATION_CHANGE) {
      console.log('state.getState()', store.getState())
      console.log('action', action)
      switch (action.payload.pathname) {
      case '/login': {
        break
      }
      case '/logout': {
        store.dispatch(doLogout())
        break
      }
      case '/': {
        requireToken(store, token => {
          store.dispatch(fetchFlags(token))
          store.dispatch(fetchAssets(token))
        })
        break
      }
      case '/conditions': {
        requireToken(store, token => {
          store.dispatch(fetchConditions(token))
        })
        break
      }
      case '/ticks': {
        requireToken(store, token => {
          store.dispatch(fetchTicks(token))
        })
        break
      }
      case '/positions': {
        requireToken(store, token => {
          store.dispatch(fetchPositions(token))
        })
        break
      }
      case '/exchangers/quoine': {
        requireToken(store, token => {
          store.dispatch(fetchQuoine(token))
        })
        break
      }
      /*
      case '/404': {
        console.log('go to /yes')
        store.dispatch(browserHistory.push('/yes'))
        return
      }
      */
      default:
        console.info('unknown pathname:', action.payload.pathname)
      }
    } else if (action.type == loginConstants.REQUEST_LOGIN) {
      store.dispatch(postLogin(action.payload))
    } else if (action.type == homeConstants.REQUEST_CHANGE_FLAG) {
      requireToken(store, token => {
        store.dispatch(postChangeFlag(token, action.payload))
      })
    } else if (action.type == conditionsConstants.REQUEST_ADD_CONDITION) {
      requireToken(store, token => {
        store.dispatch(postCondition(token, action.payload))
      })
    } else if (action.type == conditionsConstants.REQUEST_DELETE_CONDITION) {
      requireToken(store, token => {
        store.dispatch(deleteCondition(token, action.payload))
      })
    }
    return next(action)
  }
}

class mainConstants {
  static SET_ACCESS_TOKEN = "MAIN_SET_ACCESS_TOKEN"
  static SET_ACCOUNT = 'MAIN_SET_ACCOUNT'
}

const initialState = {
  number: 1,
  token: localStorage.getItem('token')
}

function mainReducer(state=initialState, action) {
  console.log('mainReducer', state, action)
  const { type, payload } = action
  if (type == mainConstants.SET_ACCESS_TOKEN) {
    localStorage.setItem('access_token', payload)
  } else if (type == mainConstants.SET_ACCOUNT) {
    return Object.assign({}, state, {
      accounts: payload
    })
  }
  return state
}

const reducers = combineReducers({
  main: mainReducer,
  login: loginReducer,
  flags: homeReducer,
  conditions: conditionsReducer,
  ticks: ticksReducer,
  positions: positionsReducer,
  quoine: quoineReducer,
  routing: routerReducer
})

const store = createStore(
  reducers,
  applyMiddleware(thunk, serverApiMiddleware)
)
const history = syncHistoryWithStore(browserHistory, store)

const NotFound = React.createClass({
  render: function() {
    return (
        <div>
          <span>Page Not Found</span>
        </div>
    )
  }
})

const Logout = React.createClass({
  render: function() {
    return (
        <div>
          <span>Logging out...</span>
        </div>
    )
  }
})

let requireLogin = (store) => (state, transition) => {
  // console.log('requireLogin', state)
  const token = localStorage.getItem('access_token')
  if (!token) {
    transition({
      pathname: '/login',
      state: { nextPathname: state.location.pathname }
    })
  } else {
    store.dispatch(refreshToken(token))
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route component={GuestApp}>
        <Route path="login" component={Login} />
        <Route path="logout" component={Logout} />
      </Route>
      <Route path="/" component={LoggedInApp}>
        <IndexRoute onEnter={requireLogin(store)}
               component={Home}/>
        <Route path="conditions" onEnter={requireLogin(store)}
               component={Conditions} />
        <Route path="ticks" onEnter={requireLogin(store)}
               component={Ticks} />
        <Route path="positions" onEnter={requireLogin(store)}
               component={Positions} />
        <Route path="exchangers/quoine" onEnter={requireLogin(store)}
               component={Quoine} />
      </Route>
      <Route path="*" component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('dashboard-app')
)
