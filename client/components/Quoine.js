import { Component } from 'react'
import { connect } from 'react-redux'

import { quoineConstants } from '../reducers/QuoineReducer'

function sum(x) {
  return x.reduce((a, b) => a + b, 0)
}

class Quoine extends Component {
  render() {
    const { state } = this.props
    console.log('this', this)
    const AccountView = 
          <table className="u-full-width">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Net Asset</td>
                <td>{state.net_asset.toFixed(1)} JPY</td>
              </tr>
              <tr>
                <td>Free Margin</td>
                <td>{state.free_margin.toFixed(1)} JPY</td>
              </tr>
              <tr>
                <td>Required Margin</td>
                <td>{state.required_margin.toFixed(1)} JPY</td>
              </tr>
              <tr>
                <td>Keep Rate</td>
                <td>{state.keep_rate.toFixed(1)} %</td>
              </tr>
              <tr>
                <td>Tick</td>
                <td>
                  ASK: {state.tick.ask}<br />
                  BID: {state.tick.bid}<br />
                  ({state.tick.datetime})
                </td>
              </tr>
            </tbody>
          </table>

    let showPosition = (position, i) => {
      let price = (p) => parseFloat(p)
      const date = new Date(position.created_at * 1000).toLocaleString()
      const pnl =
            price(position.quantity) *
            (position.side == 'long' ? 
             price(state.tick.bid) - price(position.open_price) :
             price(position.open_price) - price(state.tick.ask))
      return (
          <tr key={i}>
            <td>{date}</td>
            <td>{position.side}</td>
            <td>{price(position.open_price).toFixed(1)}</td>
            <td>{position.quantity}</td>
            <td>{pnl.toFixed(1)}</td>
            <td>{position.id}</td>
          </tr>
      )
    }
    const listPositions = state.positions.filter(
      (position, i) => position.managed
    ).map(showPosition)
    const listUnmanaged = state.positions.filter(
      (position, i) => !position.managed
    ).map(showPosition)
    const Viewer = (
      <div>
        <h2>Quoine</h2>
        <div>{AccountView}</div>
        <h3>Positions</h3>
        <div>
          <table className="u-full-width">
            <thead>
              <tr>
                <th>date</th>
                <th>side</th>
                <th>price</th>
                <th>size</th>
                <th>pnl</th>
                <th>id</th>
              </tr>
            </thead>
            <tbody>
              {listPositions}
            </tbody>
          </table>
        </div>
        <h3>Positions (unmanaged)</h3>
        <div>
          <table className="u-full-width">
            <thead>
              <tr>
                <th>date</th>
                <th>side</th>
                <th>price</th>
                <th>size</th>
                <th>pnl</th>
                <th>id</th>
              </tr>
            </thead>
            <tbody>
              {listUnmanaged}
            </tbody>
          </table>
        </div>
      </div>
    )
    return (
      <div>
        {Viewer}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state.quoine
  }
}

export default connect(mapStateToProps, {})(Quoine)
