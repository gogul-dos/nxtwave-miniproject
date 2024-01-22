import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import ThemeContext from '../Context'
import Header from '../Header'
import Search from '../Search'
import './index.css'

class Profile extends Component {
  requestStatus = {
    progress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
  }

  state = {
    urlRequestStatusProfile: this.requestStatus.progress,
    urlResult: {},
  }

  componentDidMount() {
    this.getMyProfileResults()
  }

  getMyProfileResults = async () => {
    this.setState({urlRequestStatusProfile: this.requestStatus.progress})
    const url = `https://apis.ccbp.in/insta-share/my-profile`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.setState({
        urlResult: data.profile,
        urlRequestStatusProfile: this.requestStatus.success,
      })
    } else {
      this.setState({urlRequestStatusProfile: this.requestStatus.failure})
    }
  }

  getMyProfileView = activeTheme => {
    const {urlRequestStatusProfile, urlResult} = this.state
    const backgroundStyle =
      activeTheme === 'Dark'
        ? 'my-profile-dark-theme'
        : 'my-profile-light-theme'
    switch (urlRequestStatusProfile) {
      case this.requestStatus.progress:
        return (
          <div
            className={`loader-container ${backgroundStyle}`}
            testid="loader"
          >
            <Loader type="TailSpin" color="#4094ef" />
          </div>
        )
      case this.requestStatus.failure:
        return (
          <div className={`home-failure-container ${backgroundStyle}`}>
            <img
              src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705664465/alert-triangle_e49eqv.png"
              alt="failure view"
              className="failure-image"
            />
            <p>Something went wrong. Please try again</p>
            <button
              type="button"
              onClick={this.getMyProfileResults}
              className="try-again-button"
            >
              Try Again
            </button>
          </div>
        )
      case this.requestStatus.success:
        return (
          <div className={`my-profile-main-container ${backgroundStyle}`}>
            <div className="user-profile-landscape">
              <img
                src={urlResult.profile_pic}
                alt="my profile"
                className="my-profile-image"
              />
              <div
                style={{
                  marginLeft: '35px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <h1>{urlResult.user_name}</h1>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <img
                    src={urlResult.profile_pic}
                    alt="my profile"
                    className="my-profile-image-portrait"
                  />
                  <p style={{marginLeft: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>
                      {urlResult.posts_count}
                    </span>
                    posts
                  </p>
                  <p style={{marginLeft: '15px'}}>
                    <span style={{fontWeight: 'bold'}}>
                      {urlResult.followers_count}
                    </span>
                    followers
                  </p>
                  <p style={{marginLeft: '15px'}}>
                    <span style={{fontWeight: 'bold'}}>
                      {urlResult.following_count}{' '}
                    </span>
                    following
                  </p>
                </div>
                <p>{urlResult.user_id}</p>
                <p>{urlResult.user_bio}</p>
              </div>
            </div>
            <ul className="unordered-my-story-list">
              {urlResult.stories.map(eachStory => (
                <li key={eachStory.id} className="my-profile-story-list-item">
                  <img
                    src={eachStory.image}
                    alt="my story"
                    className="my-profile-story-image"
                  />
                </li>
              ))}
            </ul>
            <hr className="horizontal-line" />
            <div style={{display: 'flex', alignItems: 'center'}}>
              <BsGrid3X3 />
              <h1 style={{marginLeft: '10px'}}>Posts</h1>
            </div>
            {urlResult.posts.length === 0 ? (
              <div className="no-post-container">
                <BiCamera className="my-post-image" />
                <h1>No Posts</h1>
              </div>
            ) : (
              <ul className="unordered-my-post-list">
                {urlResult.posts.map(eachPost => (
                  <li key={eachPost.id} className="my-post-list-item">
                    <img
                      src={eachPost.image}
                      alt="my post"
                      className="my-post-image"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {activeTheme} = value
          return (
            <div>
              <Header />

              <div>{this.getMyProfileView(activeTheme)}</div>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default Profile
