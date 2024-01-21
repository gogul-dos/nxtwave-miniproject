import React from 'react'

const ThemeContext = React.createContext({
  activeTheme: 'Dark',
  currentTab: 'Home',
  searchInput: '',
  changeTheme: () => {},
  changeCurrentTab: () => {},
  changeSearchInput: () => {},
})

export default ThemeContext
