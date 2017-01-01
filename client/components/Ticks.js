import { Component } from 'react'
import { connect } from 'react-redux'

import { ticksConstants } from '../reducers/TicksReducer'

class Ticks extends Component {
  render() {
    const { state } = this.props
    console.log('this', this)
    const listExchangers = Object.keys(state.exchangers).map(
      (name, i) => (
        <tr key={i} className="row">
          <td>{name}</td>
          <td>{state.exchangers[name].ask}</td>
          <td>{state.exchangers[name].bid}</td>
          <td>{state.exchangers[name].datetime}</td>
        </tr>
      )
    )
    return (
        <div>
          <h2>Ticks</h2>
          <div>
            <table>
              <thead>
                <tr>
                  <td>exchanger</td>
                  <td>ask</td>
                  <td>bid</td>
                  <td>datetime</td>
                </tr>
              </thead>
              <tbody>  
                {listExchangers}
              </tbody>
            </table>
          </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state.ticks
  }
}

export default connect(mapStateToProps,
  {}
)(Ticks)
