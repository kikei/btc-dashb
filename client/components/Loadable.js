import { Component } from 'react'
import { connect } from 'react-redux'

export default class Loadable extends Component {
  render() {
    return (
        <div className="loadable">
          <div className="loader" 
            style={{ display: this.props.loading ? 'block': 'none' }}>
            Loading...
          </div>
          { this.props.children }
        </div>
    )
  }
}
