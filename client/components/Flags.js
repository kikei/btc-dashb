import React, { Component } from 'react'
import { connect } from 'react-redux'

class Flags extends Component {
  render() {
    const { value, actions } = this.props
    console.log('this', this)
    return (
        <div>
          <h2>Flags</h2>
          <dl>
            <dt>Key</dt><dd>Value</dd>
          </dl>
        </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('state', state)
  return {
    number: 2
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
