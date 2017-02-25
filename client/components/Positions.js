import { Component } from 'react'
import { connect } from 'react-redux'

import { positionsConstants } from '../reducers/PositionsReducer'

function sum(x) {
  return x.reduce((a, b) => a + b, 0)
}

function price(sizes, prices) {
  return sum(sizes.map((e, i) => e * prices[i]))
}

function positions_to_totals(positions) {
  if (positions.length == 0)
    return {
      size: 0,
      pnl: 0,
      ask: {
        exchanger: '-',
        price: 0,
      },
      bid: {
        exchanger: '-',
        price: 0,
      }
    }
  
  const total = {}
  var pnl = 0
  
  for (let position of positions) {
    const ask = position.exchangers[position.ask]
    if (!total[position.ask])
      total[position.ask] = { size: 0, price: 0 }
    total[position.ask].size += sum(ask.sizes)
    total[position.ask].price += price(ask.sizes, ask.prices)
    
    const bid = position.exchangers[position.bid]
    if (!total[position.bid])
      total[position.bid] = { size: 0, price: 0 }
    total[position.bid].size -= sum(bid.sizes)
    total[position.bid].price -= price(bid.sizes, bid.prices)
    
    pnl += position.pnl
  }

  var totals = { }
  for (var exchanger in total) {
    if (total[exchanger].size > 0) {
      totals['size'] = total[exchanger].size
      totals['ask'] = {
        exchanger: exchanger,
        price: total[exchanger].price
      }
    } else {
      totals['bid'] = {
        exchanger: exchanger,
        price: -total[exchanger].price
      }
    }
  }
  totals['pnl'] = pnl
  return totals
}

class Positions extends Component {
  render() {
    const { state } = this.props

    let showTotal = (positions) => {
      const total = positions_to_totals(positions)
      return (
          <tr>
            <th>total</th>
            <td>{total.size.toFixed(1)}</td>
            <td>
              {total.ask.exchanger}<br />
              {total.ask.price.toFixed(1)}
            </td>
            <td>
              {total.bid.exchanger}<br />
              {total.bid.price.toFixed(1)}
            </td>
            <td>{total.pnl.toFixed(1)}</td>
          </tr>
      )
    }
    
    const totalPosition = showTotal(state.positions)
    const listPositions = state.positions.map(
      (position, i) => {
        const ask = position.exchangers[position.ask]
        const bid = position.exchangers[position.bid]
        const size = sum(ask.sizes)
        return (
            <tr key={i}>
              <td>{position.diff}</td>
              <td>{size}</td>
              <td>
                {position.ask}<br />
                {price(ask.sizes, ask.prices).toPrecision(6)}
              </td>
              <td>
                {position.bid}<br/>
                {price(bid.sizes, bid.prices).toPrecision(6)}
              </td>
              <td>{position.pnl.toFixed(1)}</td>
            </tr>
        )
      }
    )
    const Viewer = (
      <div>
        <h2>Positions</h2>
        <div>
          <table className="u-full-width">
            <thead>
              <tr>
                <th className="two">diff</th>
                <th className="two">size</th>
                <th className="three">ask</th>
                <th className="three">bid</th>
                <th className="two">pnl</th>
              </tr>
            </thead>
            <tbody>
              {totalPosition}
              {listPositions}
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
    state: state.positions
  }
}

export default connect(mapStateToProps, {})(Positions)
