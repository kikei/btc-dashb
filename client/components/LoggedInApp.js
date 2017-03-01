import { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class LoggedInApp extends Component {
  render() {
    const { state } = this.props
    console.log('LoggedInApp', this)
    return (
        <div className="container">
          <div className="accountbar">
            <Link to="/logout">Logout</Link>
          </div>
          <header>
            <h1>BitcoinArb Dashboard</h1>
            <nav className="navbar">
              <div className="container">
                <ul>
                  <li>
                    <Link to="/" className="button">Home</Link>
                  </li>
                  <li>
                    <Link to="/conditions" className="button">Conditions</Link>
                  </li>
                  <li>
                    <Link to="/ticks" className="button">Ticks</Link>
                  </li>
                  <li>
                    <Link to="/positions" className="button">Positions</Link>
                  </li>
                  <li>
                    <Link to="/exchangers/quoine" className="button">Quoine</Link>
                  </li>
                </ul>
              </div>
              <div className="container">
                <ul>
                  <li>
                    <a href="/api/flags">/api/flags</a>
                  </li>
                  <li>
                    <a href="/api/assets">/api/assets</a>
                  </li>
                  <li>
                    <a href="/api/conditions">/api/conditions</a>
                  </li>
                  <li>
                    <a href="/api/ticks">/api/ticks</a>
                  </li>
                  <li>
                    <a href="/api/positions">/api/positions</a>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          <div>
          { this.props.children }
          </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps, {
})(LoggedInApp)
