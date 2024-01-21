import {Component} from 'react'
import Cookies from 'js-cookie'
import ThemeContext from '../Context'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMessage: false,
    errorMessage: '',
  }

  usernameChanged = event => {
    this.setState({username: event.target.value})
  }

  passwordChanged = event => {
    this.setState({password: event.target.value})
  }

  showPasswordToggled = event => {
    if (event.target.checked) {
      document.getElementById('password').type = 'text'
    } else {
      document.getElementById('password').type = 'password'
    }
  }

  loginFormSubmitted = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const {history} = this.props
    const userDetails = {username, password}

    try {
      const response = await fetch('https://apis.ccbp.in/login', {
        method: 'POST',
        body: JSON.stringify(userDetails),
      })

      if (response.ok) {
        const {
          jwt_token: jwtToken,
          error_msg: errorMessage,
        } = await response.json()
        Cookies.set('jwt_token', jwtToken, {expires: 15})
        this.setState({showErrorMessage: false, errorMessage})
        history.replace('/')
      } else {
        const {error_msg: errorMessage} = await response.json()
        this.setState({showErrorMessage: true, errorMessage})
      }
    } catch (error) {
      console.error('Error during login:', error)
      this.setState({
        showErrorMessage: true,
        errorMessage: 'An error occurred during login.',
      })
    }
  }

  render() {
    const {username, password, showErrorMessage, errorMessage} = this.state
    const {history} = this.props
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      history.replace('/')
    }
    return (
      <ThemeContext.Consumer>
        {value => {
          const {activeTheme} = value
          const mainLoginContainer =
            activeTheme === 'Dark'
              ? 'dark-main-container'
              : 'light-main-container'
          const formContainer =
            activeTheme === 'Dark'
              ? 'dark-form-container'
              : 'light-form-container'
          return (
            <div className={`main-login-container ${mainLoginContainer}`}>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <img
                  src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705640023/Illustration_uhjggi.png"
                  className="login-image"
                  alt="website login"
                />
                <div className={`login-form-container ${formContainer}`}>
                  <div className="login-logo-container">
                    <img
                      src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705640022/logo_oaxiab.png"
                      className="login-logo"
                      alt="website logo"
                    />
                    <h1>Insta Share</h1>
                  </div>
                  <form
                    className="form-container"
                    onSubmit={this.loginFormSubmitted}
                  >
                    <label htmlFor="username" style={{fontSize: '12px'}}>
                      USERNAME
                    </label>
                    <input
                      value={username}
                      onChange={this.usernameChanged}
                      style={{marginBottom: '15px'}}
                      id="username"
                      type="text"
                      placeholder="Username"
                      className="input-element"
                    />
                    <label htmlFor="password" style={{fontSize: '12px'}}>
                      PASSWORD
                    </label>
                    <input
                      value={password}
                      onChange={this.passwordChanged}
                      style={{marginBottom: '15px'}}
                      id="password"
                      type="password"
                      placeholder="Password"
                      className="input-element"
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '15px',
                      }}
                    >
                      <input
                        id="showPassword"
                        type="checkbox"
                        onChange={this.showPasswordToggled}
                      />
                      <label htmlFor="showPassword" style={{fontSize: '15px'}}>
                        Show Password
                      </label>
                    </div>
                    {showErrorMessage && (
                      <p style={{color: 'red'}}>{errorMessage}</p>
                    )}
                    <button type="submit" className="login-button">
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}
export default Login
