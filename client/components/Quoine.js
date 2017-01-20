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
    let showPosition = (position, i) => {
      let price = (p) => parseFloat(p)
      const date = new Date(position.created_at * 1000).toLocaleString()
      return (
          <tr key={i}>
          <td>{date}</td>
          <td>{position.side}</td>
          <td>{price(position.open_price).toFixed(1)}</td>
          <td>{position.quantity}</td>
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
        <h2>Quoine Positions</h2>
        <div>
          <table className="u-full-width">
            <thead>
              <tr>
                <th className="two">date</th>
                <th className="two">side</th>
                <th className="three">price</th>
                <th className="three">size</th>
                <th className="two">id</th>
              </tr>
            </thead>
            <tbody>
              {listPositions}
            </tbody>
          </table>
        </div>
        <h2>Quoine Positions (unmanaged)</h2>
        <div>
          <table className="u-full-width">
            <thead>
              <tr>
                <th className="two">date</th>
                <th className="two">side</th>
                <th className="three">price</th>
                <th className="three">size</th>
                <th className="two">id</th>
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
