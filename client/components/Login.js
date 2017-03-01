import { Component } from 'react'
import { connect } from 'react-redux'

import { loginConstants } from '../reducers/LoginReducer'

class Login extends Component {
  changeUsername(e) {
    e.preventDefault()
    this.props.setUsername(e.target.value)
  }
  changePassword(e) {
    e.preventDefault()
    this.props.setPassword(e.target.value)
  }
  clickLogin(e) {
    e.preventDefault()
    const { editUsername, editPassword } = this.props.state
    this.props.requestLogin(editUsername, editPassword)
  }
  render() {
    const { state } = this.props
    console.log('Login', state, this.props)
    return (
        <div className="center-container">
        <div className="center-box">
          <div>
            <label htmlFor="input-username">Username:</label>
            <input type="text" onChange={this.changeUsername.bind(this)}
              value={state.editUsername} 
              className="u-full-width" />
          </div>
          <div>
            <label htmlFor="input-password">Password:</label>
            <input type="password" onChange={this.changePassword.bind(this)}
              value={state.editPassword} 
              className="u-full-width" />
          </div>
          <div>
            <button onClick={this.clickLogin.bind(this)}
              className="button-primary u-full-width">
              Login
            </button>
          </div>
        </div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state.login
  }
}

export default connect(mapStateToProps,
  {
    setUsername: (username) => ({
      type: loginConstants.SET_USERNAME,
      payload: username
    }),
    setPassword: (password) => ({
      type: loginConstants.SET_PASSWORD,
      payload: password
    }),
    requestLogin: (username, password) => ({
      type: loginConstants.REQUEST_LOGIN,
      payload: { username: username, password: password }
    })
  }
)(Login)
