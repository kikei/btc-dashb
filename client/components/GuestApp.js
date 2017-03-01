import React from 'react'
import { Link, browserHistory } from 'react-router'

export const GuestApp = React.createClass({
  render: function() {
    const { state } = this.props
    console.log('GuestApp', this)
    return (
        <div className="container">
          <header>
            <h1>BitcoinArb Dashboard</h1>
          </header>
          <div>
          { this.props.children }
          </div>
        </div>
    )
  }
})
