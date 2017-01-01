import { Component } from 'react'
import { connect } from 'react-redux'

import { conditionsConstants } from '../reducers/ConditionsReducer'

class Conditions extends Component {
  changeDiff(e) {
    e.preventDefault()
    this.props.setDiff(e.target.value)
  }
  changeLots(e) {
    e.preventDefault()
    this.props.setLots(e.target.value)
  }
  changeProfit(e) {
    e.preventDefault()
    this.props.setProfit(e.target.value)
  }
  clickAdd(e) {
    e.preventDefault()
    const { editDiff, editLots, editProfit } = this.props.state
    this.props.requestAddCondition(parseInt(editDiff), 
                                   parseFloat(editLots),
                                   parseFloat(editProfit)
    )
  }
  clickDelete(e) {
    e.preventDefault()
    const { editDiff } = this.props.state
    this.props.requestDeleteCondition(parseInt(editDiff))
  }
  clickCondition({ diff, lots, profit }, e) {
    this.props.setDiff(diff)
    this.props.setLots(lots)
    this.props.setProfit(profit)
  }
  render() {
    const { state } = this.props
    console.log('this', this)
    const listConditions = state.conditions.map(
      (condition, i) => (
        <tr key={i} className="row"
           onClick={this.clickCondition.bind(this, condition)}>
          <td>{condition.diff}</td>
          <td>{condition.lots}</td>
          <td>{condition.profit}</td>
        </tr>
      ))
    const Viewer = (
      <div>
        <h2>Conditions</h2>
        <div>
          <table className="u-full-width">
            <thead>
              <tr>
                <th className="three">diff</th>
                <th className="three">lots</th>
                <th className="three">profit</th>
              </tr>
            </thead>
            <tbody>
              {listConditions}
            </tbody>
          </table>
        </div>
      </div>
    )
    const Editor = (
      <div>
        <h2>Add</h2>
        <form action="/conditions" method="POST">
          <div className="row">
            <div className="three columns">
              <label htmlFor="input-condition-diff">
                Prices diff.
              </label>
              <input type="text" onChange={this.changeDiff.bind(this)}
                 value={state.editDiff}
                 id="input-condition-diff" name="diff" 
                 placeholder="100" className="u-full-width" />
            </div>
            <div className="three columns">
              <label htmlFor="input-condition-lots">
                Order lot
              </label>
              <input type="text" onChange={this.changeLots.bind(this)}
                 value={state.editLots}
                 id="input-condition-lots" name="lots"
                 placeholder="0.5"  className="u-full-width" />
            </div>
            <div className="three columns">
              <label htmlFor="input-condition-profit">
                Closing profit
              </label>
              <input type="text" onChange={this.changeProfit.bind(this)}
                 value={state.editProfit}
                 id="input-condition-profit" name="profit" 
                 placeholder="50"  className="u-full-width" />
            </div>
          </div>
          <button onClick={this.clickAdd.bind(this)} className="button-primary">
            Add/Update
          </button>
          {' '}
          <button onClick={this.clickDelete.bind(this)}>
            Delete
          </button>
        </form>
      </div>
    )
    return (
      <div>
        {Viewer}
        {Editor}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state.conditions
  }
}

export default connect(mapStateToProps,
  {
    setDiff: (diff) => ({
      type: conditionsConstants.SET_DIFF,
      payload: diff
    }),
    setLots: (lots) => ({
      type: conditionsConstants.SET_LOTS,
      payload: lots
    }),
    setProfit: (profit) => ({
      type: conditionsConstants.SET_PROFIT,
      payload: profit
    }),
    addCondition: (condition) => ({
      type: conditionsConstants.ADD_CONDITION,
      payload: condition
    }),
    deleteCondition: (diff) => ({
      type: conditionsConstants.DELETE_CONDITION,
      payload: diff
    }),
    requestAddCondition: (diff, lots, profit) => ({
      type: conditionsConstants.REQUEST_ADD_CONDITION,
      payload: { diff: diff, lots: lots, profit: profit }
    }),
    requestDeleteCondition: (diff) => ({
      type: conditionsConstants.REQUEST_DELETE_CONDITION,
      payload: diff
    }),
  }
)(Conditions)
