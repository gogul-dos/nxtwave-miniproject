import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import Loader from 'react-loader-spinner'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import Search from '../Search'
import ThemeContext from '../Context'
import Header from '../Header'
import './index.css'

class Home extends Component {
  requestStatus = {
    progress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
  }

  state = {
    urlRequestStatus: this.requestStatus.progress,
    urlResult: [],
    storyRequestStatus: this.requestStatus.progress,
    storyResult: [],
  }

  componentDidMount() {
    this.getStoryResults()
    this.getPostResults()
  }

  getStoryResults = async () => {
    this.setState({storyRequestStatus: this.requestStatus.progress})
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedData = data.users_stories.map(eachStory => ({
        userId: eachStory.user_id,
        userName: eachStory.user_name,
        storyUrl: eachStory.story_url,
      }))
      this.setState({
        storyRequestStatus: this.requestStatus.success,
        storyResult: formattedData,
      })
    } else {
      this.setState({storyRequestStatus: this.requestStatus.failure})
    }
  }

  getPostResults = async () => {
    this.setState({urlRequestStatus: this.requestStatus.progress})
    const url = 'https://apis.ccbp.in/insta-share/posts'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const formattedPostData = data.posts.map(eachPost => ({
        postId: eachPost.post_id,
        comments: eachPost.comments,
        likesCount: eachPost.likes_count,
        postDetails: eachPost.post_details,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
        createdAt: eachPost.created_at,
        like_status: false,
      }))
      this.setState({
        urlRequestStatus: this.requestStatus.success,
        urlResult: formattedPostData,
      })
      console.log(formattedPostData)
      console.log(data)
    } else {
      this.setState({urlRequestStatus: this.requestStatus.failure})
    }
  }

  getStoryView = activeTheme => {
    const {storyRequestStatus, storyResult} = this.state
    const settings = {
      slidesToShow: 6,
      slidesToScroll: 3,
    }
    const settings1 = {
      slidesToShow: 4,
      slidesToScroll: 3,
    }
    const fontColor = activeTheme === 'Dark' ? 'dark-color' : 'light-color'
    switch (storyRequestStatus) {
      case this.requestStatus.progress:
        return (
          <div className="loader-container-story" data-testid="loader">
            <Loader type="TailSpin" color="#4094ef" />
          </div>
        )
      case this.requestStatus.failure:
        return (
          <div className={`home-story-failure-container ${fontColor}`}>
            <img
              src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705664465/alert-triangle_e49eqv.png"
              alt="failure"
              className="failure-image"
            />
            <h1>Something went wrong. Please try again</h1>
            <button
              type="button"
              onClick={this.getStoryResults}
              className="try-again-button"
            >
              Try Again
            </button>
          </div>
        )
      case this.requestStatus.success:
        return (
          <>
            <div className={`slider-container-landscape ${fontColor}`}>
              <Slider {...settings}>
                {storyResult.map(eachStory => (
                  <div key={eachStory.userId} className="story-container">
                    <img
                      src={eachStory.storyUrl}
                      alt="user story"
                      className="user-story-image"
                    />
                    <p>{eachStory.userName}</p>
                  </div>
                ))}
              </Slider>
            </div>
            <div>
              <div className={`slider-container-portrait ${fontColor}`}>
                <Slider {...settings1}>
                  {storyResult.map(eachStory => (
                    <div key={eachStory.userId} className="story-container">
                      <img
                        src={eachStory.storyUrl}
                        alt="user story"
                        className="user-story-image"
                      />
                      <p>{eachStory.userName}</p>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </>
        )
      default:
        return null
    }
  }

  postLiked = async postId => {
    const {urlResult} = this.state
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      body: JSON.stringify({like_status: true}),
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (data.message === 'Post has been liked') {
      const changedData = urlResult.map(eachPost => {
        if (eachPost.postId === postId) {
          return {
            ...eachPost,
            like_status: true,
            likesCount: eachPost.likesCount + 1,
          }
        }
        return {
          ...eachPost,
        }
      })
      this.setState({urlResult: changedData})
    }
  }

  postUnLiked = async postId => {
    const {urlResult} = this.state
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'POST',
      body: JSON.stringify({like_status: false}),
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (data.message === 'Post has been disliked') {
      const changedData = urlResult.map(eachPost => {
        if (eachPost.postId === postId) {
          return {
            ...eachPost,
            like_status: false,
            likesCount: eachPost.likesCount - 1,
          }
        }
        return {
          ...eachPost,
        }
      })
      this.setState({urlResult: changedData})
    }
  }

  tryAgainPost = () => {
    this.getPostResults()
  }

  getCorrespondingView = (activeTheme, changeCurrentTab) => {
    const {urlRequestStatus, urlResult} = this.state
    const fontColor = activeTheme === 'Dark' ? 'dark-color' : 'light-color'
    const iconColor = activeTheme === 'Dark' ? '#ffffff' : '#000000'
    const shadowColor = activeTheme === 'Dark' ? '#333' : '#888888'
    const postBackColor =
      activeTheme === 'Dark' ? 'post-dark-background' : 'post-light-background'
    switch (urlRequestStatus) {
      case this.requestStatus.progress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="TailSpin" color="#4094ef" />
          </div>
        )
      case this.requestStatus.failure:
        return (
          <div className="home-failure-container">
            <img
              src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705664465/alert-triangle_e49eqv.png"
              alt="failure view"
              className="failure-image"
            />
            <h1>Something went wrong. Please try again</h1>
            <button
              type="button"
              onClick={this.tryAgainPost}
              className="try-again-button"
            >
              Try Again
            </button>
          </div>
        )
      case this.requestStatus.success:
        return (
          <ul className="post-unordered-list">
            {urlResult.map(eachPost => (
              <li
                className={`post-list-item ${postBackColor}`}
                style={{boxShadow: `5px 5px 10px ${shadowColor}`}}
                key={eachPost.postId}
              >
                <div className="user-name-container">
                  <img
                    src={eachPost.profilePic}
                    alt="post author profile"
                    className="user-profile-image"
                  />
                  <Link
                    to={`/user-profile/${eachPost.userId}`}
                    className={`username-link ${fontColor}`}
                    onClick={() => changeCurrentTab('userProfile')}
                  >
                    {eachPost.userName}
                  </Link>
                </div>
                <img
                  src={eachPost.postDetails.image_url}
                  alt="post"
                  className="post-image"
                />
                <div className="likes-comment-container">
                  {!eachPost.like_status && (
                    <button
                      type="button"
                      label="likeIcon"
                      data-testid="likeIcon"
                      className="like-button"
                    >
                      <BsHeart
                        color={`${iconColor}`}
                        style={{
                          marginRight: '10px',
                          height: '20px',
                          width: '20px',
                        }}
                        onClick={() => this.postLiked(eachPost.postId)}
                      />
                    </button>
                  )}
                  {eachPost.like_status && (
                    <button
                      type="button"
                      label="unLikeIconv"
                      data-testid="unLikeIcon"
                      className="like-button"
                    >
                      <FcLike
                        style={{
                          marginRight: '10px',
                          height: '20px',
                          width: '20px',
                        }}
                        onClick={() => this.postUnLiked(eachPost.postId)}
                      />
                    </button>
                  )}
                  <FaRegComment
                    style={{marginRight: '10px', height: '20px', width: '20px'}}
                  />
                  <BiShareAlt
                    style={{marginRight: '10px', height: '20px', width: '20px'}}
                  />
                </div>
                <p style={{fontWeight: 'bold'}}>{eachPost.likesCount} likes</p>
                <p>{eachPost.postDetails.caption}</p>
                <ul className="unordered-comment-list">
                  {eachPost.comments.map(eachComment => (
                    <li key={eachComment.user_id} className="comment-list-item">
                      <p style={{fontWeight: 'bold'}}>
                        {eachComment.user_name}
                      </p>
                      <p style={{marginLeft: '5px'}}>{eachComment.comment}</p>
                    </li>
                  ))}
                </ul>
                <p style={{color: 'gray'}}>{eachPost.createdAt}</p>
              </li>
            ))}
          </ul>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {value => {
          const {activeTheme, changeCurrentTab, searchInput, currentTab} = value
          const backgroundTheme =
            activeTheme === 'Dark'
              ? 'home-dark-container'
              : 'home-light-container'
          return (
            <div>
              <Header />
              <div>
                <div>
                  {searchInput === '' && currentTab === 'Home' ? (
                    <div className={`main-home-container ${backgroundTheme}`}>
                      {this.getStoryView(activeTheme)}
                      {this.getCorrespondingView(activeTheme, changeCurrentTab)}
                    </div>
                  ) : (
                    <Search />
                  )}
                </div>
              </div>
            </div>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

export default Home
