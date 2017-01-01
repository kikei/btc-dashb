import React from 'react'
import { Link, browserHistory } from 'react-router'

export const MainApp = React.createClass({
  render: function() {
    return (
        <div className="container">
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
})

/*
export default function App({ children }) {
  return (
    <div>
      <header>
        Links:
        {' '}
        <Link to="/">Home</Link>
        {' '}
        <Link to="/foo">Foo</Link>
        {' '}
        <Link to="/bar">Bar</Link>
      </header>
      <div>
        <button onClick={() => browserHistory.push('/foo')}>Go to /foo</button>
      </div>
      <div style={{ marginTop: '1.5em' }}>{children}</div>
    </div>
  )
}
*/
