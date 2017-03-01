import { Component } from 'react'
import { connect } from 'react-redux'

import { homeConstants } from '../reducers/HomeReducer'
import Loadable from './Loadable'

class Home extends Component {
  onOffClick(e) {
    e.preventDefault()
    const onoff = this.props.state.flags.onoff
    this.props.requestChangeFlag('onoff', !onoff)
  }

  render() {
    const { state } = this.props
    console.log('this', this)
    return (
        <div>
          <h2>Flags</h2>
          <Loadable loading={state.flagsLoading}>
            <table className="u-full-width">
              <thead>
                <tr>
                  <th className="three">Key</th>
                  <th className="three">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>onoff</td>
                  <td>
                    <a href="#" onClick={this.onOffClick.bind(this)}>
                      { state.flags.onoff ? 'on' : 'off' }
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </Loadable>
          <h2>Assets</h2>
          <Loadable loading={state.assetsLoading}>
            <table className="u-full-width">
              <thead>
                <tr>
                  <td className="three">Exchanger</td>
                  <td className="three">Net Asset Value</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>bitFlyer</td>
                  <td>
                    { state.assets.exchangers.bitflyer.net_asset.toFixed(1) }
                  </td>
                </tr>
                <tr>
                  <td>Quoine</td>
                  <td>
                    { state.assets.exchangers.quoine.net_asset.toFixed(1) }
                  </td>
                </tr>
                <tr>
                  <th>total</th>
                  <td>
                    { state.assets.total.net_asset.toFixed(1) }
                  </td>
                </tr>
              </tbody>
            </table>
          </Loadable>
        </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    state: state.flags
  }
}

function changeFlag(key, value) {
  return {
    type: homeConstants.CHANGE_FLAG,
    payload: { key: key, value: value }
  }
}

export default connect(mapStateToProps, {
  changeFlag: changeFlag,
  requestChangeFlag: (key, value) => ({
    type: homeConstants.REQUEST_CHANGE_FLAG,
    payload: { key: key, value: value }
  })
})(Home)
