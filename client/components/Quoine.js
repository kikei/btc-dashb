import { Component } from 'react'
import { connect } from 'react-redux'

import { quoineConstants } from '../reducers/QuoineReducer'

function sum(x) {
  return x.reduce((a, b) => a + b, 0)
}

function toPrice(p) {
  return parseFloat(p)
}

function calcPnl(position, tick) {
  return toPrice(position.quantity) *
    (position.side == 'long' ? 
     toPrice(tick.bid) - toPrice(position.open_price) :
     toPrice(position.open_price) - toPrice(tick.ask))
}

function positions_to_total(positions, tick) {
  if (positions.length == 0)
    return {
      side: '-',
      price: 0,
      size: 0,
      pnl: 0
    }
  var pnl = 0
  var price = 0
  var size = 0
  for (let position of positions) {
    if (position.side == 'long') {
      price += toPrice(position.open_price)
      size += toPrice(position.quantity)
    } else {
      price -= toPrice(position.open_price)
      size -= toPrice(position.quantity)
    }
    pnl += calcPnl(position, tick)
  }
  return price > 0 ? {
    side: 'long',
    price: price,
    size: size,
    pnl: pnl
  } : {
    side: 'short',
    price: -price,
    size: -size,
    pnl: pnl
  }
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

    const managedPositions = state.positions.filter(
      (position, i) => position.managed
    )
    const unmanagedPositions = state.positions.filter(
      (position, i) => !position.managed
    )
    let showTotal = (positions) => {
      const total = positions_to_total(positions, state.tick)
      console.log('total', total)
      return (
          <tr>
            <th>total</th>
            <td>{total.side}</td>
            <td>{total.price.toFixed(1)}</td>
            <td>{total.size.toFixed(2)}</td>
            <td>{total.pnl.toFixed(1)}</td>
            <td>-</td>
          </tr>
      )
    }
    let showPosition = (position, i) => {
      const date = new Date(position.created_at * 1000).toLocaleString()
      const pnl = calcPnl(position, state.tick)
      return (
          <tr key={i}>
            <td>{date}</td>
            <td>{position.side}</td>
            <td>{toPrice(position.open_price).toFixed(1)}</td>
            <td>{position.quantity}</td>
            <td>{pnl.toFixed(1)}</td>
            <td>{position.id}</td>
          </tr>
      )
    }
    const totalManaged = showTotal(managedPositions)
    const totalUnmanaged = showTotal(unmanagedPositions)
    const listPositions = managedPositions.map(showPosition)
    const listUnmanaged = unmanagedPositions.map(showPosition)
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
              {totalManaged}
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
              {totalUnmanaged}
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
