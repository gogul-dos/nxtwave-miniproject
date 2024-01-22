import React from 'react'

const ThemeContext = React.createContext({
  activeTheme: 'Dark',
  currentTab: 'Home',
  searchInput: '',
  buttonClicked: 0,
  increaseButtonClicked: () => {},
  changeTheme: () => {},
  changeCurrentTab: () => {},
  changeSearchInput: () => {},
})

export default ThemeContext
