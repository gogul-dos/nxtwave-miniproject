import {Link} from 'react-router-dom'
import ThemeContext from '../Context'
import './index.css'

const NotFound = () => (
  <ThemeContext.Consumer>
    {value => {
      const {activeTheme} = value

      const backgroundColor =
        activeTheme === 'Dark' ? 'home-dark-container' : 'home-light-container'

      console.log('not-found-component')

      return (
        <div className={`${backgroundColor} not-found-main-container`}>
          <img
            src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705729871/erroring_1_lzmjpy.png"
            alt="page not found"
            className="not-found-image"
          />
          <h1>Page Not Found</h1>
          <p>
            we are sorry, the page you requested could not be found. Please go
            back to the homepage.
          </p>
          <Link to="/">
            <button type="button" className="not-found-button">
              Home Page
            </button>
          </Link>
        </div>
      )
    }}
  </ThemeContext.Consumer>
)

export default NotFound
