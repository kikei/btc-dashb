import React from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, LOCATION_CHANGE } from 'react-router-redux'

/* MainApp */
import { MainApp } from './components/MainApp'

/* Home */
import Home from './components/Home'
import { homeReducer, homeConstants } from './reducers/HomeReducer'

/* Conditions */
import Conditions from './components/Conditions'
import { conditionsReducer, conditionsConstants } from './reducers/ConditionsReducer'

/* Ticks */
import Ticks from './components/Ticks'
import { ticksReducer, ticksConstants } from './reducers/TicksReducer'

const fetchFlags = dispatch => {
  fetch('/api/flags')
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

const fetchAssets = dispatch => {
  fetch('/api/assets')
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

const fetchConditions = dispatch => {
  fetch('/api/conditions')
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

const fetchTicks = dispatch => {
  fetch('/api/ticks')
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

const postChangeFlag = ({ key, value}) => dispatch => {
  const body = {
    value: value
  }
  fetch('/api/flags/' + key, {
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

const postCondition = condition => dispatch => {
  const body = {
    diff: condition.diff,
    lots: condition.lots,
    profit: condition.profit
  }
  fetch('/api/conditions', {
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

const deleteCondition = diff => dispatch => {
  fetch('/api/conditions/' + diff, {
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

const serverApiMiddleware = store => next => {
  return action => {
    if (!action) return;
    if (action.type == LOCATION_CHANGE) {
      switch (action.payload.pathname) {
      case '/': {
        store.dispatch(fetchFlags)
        store.dispatch(fetchAssets)
        break
      }
      case '/conditions': {
        store.dispatch(fetchConditions)
        break
      }
      case '/ticks': {
        store.dispatch(fetchTicks)
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
    } else if (action.type == homeConstants.REQUEST_CHANGE_FLAG) {
      store.dispatch(postChangeFlag(action.payload))
    } else if (action.type == conditionsConstants.REQUEST_ADD_CONDITION) {
      store.dispatch(postCondition(action.payload))
    } else if (action.type == conditionsConstants.REQUEST_DELETE_CONDITION) {
      store.dispatch(deleteCondition(action.payload))
    }
    return next(action)
  }
}

const initialState = {
  number: 1
}
function mainReducer(state=initialState, action) {
  console.log('mainReducer', state, action)
  return state
}

const reducers = combineReducers({
  main: mainReducer,
  flags: homeReducer,
  conditions: conditionsReducer,
  ticks: ticksReducer,
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
    );
  }
})

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={MainApp}>
        <IndexRoute component={Home}/>
        <Route path="/conditions" component={Conditions} />
        <Route path="/ticks" component={Ticks} />
        <Route path="*" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('dashboard-app')
)
