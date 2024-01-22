import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import UserProfile from './components/UserProfile'
import NotFound from './components/NotFound'
import ThemeContext from './components/Context'
import './App.css'

class App extends Component {
  state = {
    activeTheme: 'Light',
    currentTab: 'Home',
    searchInput: '',
    buttonClicked: 0,
  }

  changeTheme = () => {
    const {activeTheme} = this.state
    let newTheme
    if (activeTheme === 'Dark') {
      newTheme = 'Light'
    } else {
      newTheme = 'Dark'
    }
    this.setState({activeTheme: newTheme})
  }

  changeCurrentTab = newTab => {
    this.setState({currentTab: newTab})
    if (newTab === 'Search') {
      this.setState({buttonClicked: 0})
    }
  }

  changeSearchInput = searchValue => {
    this.setState({searchInput: searchValue})
  }

  increaseButtonClicked = () => {
    this.setState({buttonClicked: 1})
  }

  render() {
    const {activeTheme, currentTab, searchInput, buttonClicked} = this.state
    return (
      <ThemeContext.Provider
        value={{
          activeTheme,
          currentTab,
          searchInput,
          buttonClicked,
          increaseButtonClicked: this.increaseButtonClicked,
          changeTheme: this.changeTheme,
          changeCurrentTab: this.changeCurrentTab,
          changeSearchInput: this.changeSearchInput,
        }}
      >
        <Switch>
          <Route exact path="/Login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/profile" component={Profile} />
          <ProtectedRoute
            exact
            path="/user-profile/:user_id"
            component={UserProfile}
          />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </ThemeContext.Provider>
    )
  }
}

export default App
