import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch, FaMoon, FaSun} from 'react-icons/fa'
import {IoIosCloseCircle} from 'react-icons/io'
import {GiHamburgerMenu} from 'react-icons/gi'
import ThemeContext from '../Context'
import './index.css'

class Header extends Component {
  state = {searchInput: '', isPortraitMenuOpen: false}

  hamburgerButtonClicked = () => {
    this.setState(prevState => ({
      isPortraitMenuOpen: !prevState.isPortraitMenuOpen,
    }))
  }

  logoutButtonClicked = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  inputChanged = event => {
    this.setState({searchInput: event.target.value})
  }

  render() {
    const {searchInput, isPortraitMenuOpen} = this.state
    return (
      <ThemeContext.Consumer>
        {value => {
          const {
            activeTheme,
            currentTab,
            changeTheme,
            changeCurrentTab,
            changeSearchInput,
            increaseButtonClicked,
          } = value
          const themeButtonClicked = () => {
            changeTheme()
          }
          const backgroundColor =
            activeTheme === 'Dark'
              ? 'dark-navbar-container'
              : 'light-navbar-container'
          const fontColor = activeTheme === 'Dark' ? '#ffffff' : '#000000'
          return (
            <nav className={`${backgroundColor}`}>
              <div className="navbar-container-landscape">
                <Link
                  to="/"
                  onClick={() => changeCurrentTab('Home')}
                  className={`link-item ${backgroundColor}`}
                >
                  <div className="navbar-left-container">
                    <img
                      src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705640022/logo_oaxiab.png"
                      alt="website logo"
                      className="website-logo-image"
                    />
                    <h1>Insta Share</h1>{' '}
                  </div>
                </Link>
                <button
                  label="hamburger"
                  className="hamburger-button"
                  type="button"
                  onClick={this.hamburgerButtonClicked}
                >
                  <GiHamburgerMenu
                    style={{color: fontColor, height: '30px', width: '30px'}}
                  />
                </button>
                <div className="navbar-right-container">
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                      type="search"
                      className="search-element"
                      onChange={this.inputChanged}
                      placeholder="Search Caption"
                    />

                    <button
                      type="button"
                      label="search"
                      data-testid="searchIcon"
                      className="search-icon-container"
                      onClick={() => {
                        changeCurrentTab('Search')
                        changeSearchInput(searchInput)
                      }}
                    >
                      <FaSearch style={{height: '15px', width: '15px'}} />
                    </button>
                  </div>
                  <button
                    onClick={themeButtonClicked}
                    label="themeButton"
                    type="button"
                    className="theme-change-button"
                  >
                    {activeTheme === 'Light' && (
                      <FaMoon style={{height: '22px', width: 'auto'}} />
                    )}
                    {activeTheme === 'Dark' && (
                      <FaSun
                        style={{height: '22px', width: 'auto', color: 'White'}}
                      />
                    )}
                  </button>
                  <ul className="navbar-unordered-list">
                    <li>
                      <Link
                        to="/"
                        style={{
                          color: currentTab === 'Home' ? '#4094ef' : '',
                          fontWeight: currentTab === 'Home' ? 'Bold' : '',
                        }}
                        className={`link-item ${backgroundColor}`}
                        onClick={() => changeCurrentTab('Home')}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-profile"
                        style={{
                          color: currentTab === 'Profile' ? '#4094ef' : '',
                          fontWeight: currentTab === 'Profile' ? 'Bold' : '',
                        }}
                        className={`link-item ${backgroundColor}`}
                        onClick={() => changeCurrentTab('Profile')}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={this.logoutButtonClicked}
                        type="button"
                        className="logout-button"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {isPortraitMenuOpen && (
                <ul className="portrait-links-container">
                  <li>
                    <Link to="/">
                      <button
                        type="button"
                        onClick={() => {
                          changeCurrentTab('Search')
                        }}
                        style={{
                          color: currentTab === 'Search' ? '#4094ef' : '',
                          fontWeight: currentTab === 'Search' ? 'Bold' : '',
                        }}
                        className={`search-button ${backgroundColor}`}
                      >
                        Search
                      </button>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      onClick={() => {
                        changeCurrentTab('Home')
                      }}
                      style={{
                        color: currentTab === 'Home' ? '#4094ef' : '',
                        fontWeight: currentTab === 'Home' ? 'Bold' : '',
                      }}
                      className={`link-item ${backgroundColor}`}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-profile"
                      onClick={() => {
                        changeCurrentTab('Profile')
                      }}
                      style={{
                        color: currentTab === 'Profile' ? '#4094ef' : '',
                        fontWeight: currentTab === 'Profile' ? 'Bold' : '',
                      }}
                      className={`link-item ${backgroundColor}`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        this.logoutButtonClicked()
                        this.hamburgerButtonClicked()
                      }}
                      type="button"
                      className="logout-button"
                    >
                      Logout
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        themeButtonClicked()
                      }}
                      label="themeButton"
                      type="button"
                      className="theme-change-button"
                    >
                      {activeTheme === 'Light' && (
                        <FaMoon style={{height: '22px', width: 'auto'}} />
                      )}
                      {activeTheme === 'Dark' && (
                        <FaSun
                          style={{
                            height: '22px',
                            width: 'auto',
                            color: 'White',
                          }}
                        />
                      )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={this.hamburgerButtonClicked}
                      type="button"
                      label="close-button"
                      className="close-button"
                    >
                      <IoIosCloseCircle
                        style={{height: '22px', width: 'auto'}}
                      />
                    </button>
                  </li>
                </ul>
              )}
              <hr />
              {currentTab === 'Search' && window.innerWidth <= 768 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <input
                    type="search"
                    className="search-element"
                    placeholder="Search Caption"
                    id="portraitSearch"
                    onChange={this.inputChanged}
                  />

                  <button
                    type="button"
                    label="search"
                    data-testid="searchIcon"
                    className="search-icon-container"
                    onClick={() => {
                      changeCurrentTab('Search')
                      changeSearchInput(searchInput)
                      increaseButtonClicked()
                    }}
                  >
                    <FaSearch style={{height: '15px', width: '15px'}} />
                  </button>
                </div>
              )}
            </nav>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default withRouter(Header)
