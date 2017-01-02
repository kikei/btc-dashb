import { Component } from 'react'
import { connect } from 'react-redux'

import { positionsConstants } from '../reducers/PositionsReducer'

function sum(x) {
  return x.reduce((a, b) => a + b, 0)
}

class Positions extends Component {
  render() {
    const { state } = this.props
    console.log('this', this)
    const listPositions = state.positions.map(
      (position, i) => {
        let price = (sizes, prices) =>
            sum(sizes.map((e, i) => e * prices[i]))
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
              <td>{position.slip.toFixed(1)}</td>
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
                <th className="two">slip</th>
              </tr>
            </thead>
            <tbody>
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
