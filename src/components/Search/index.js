import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {GrSearchAdvanced} from 'react-icons/gr'
import {BiShareAlt} from 'react-icons/bi'
import ThemeContext from '../Context'
import './index.css'

class Search extends Component {
  requestStatus = {
    progress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
  }

  state = {
    urlRequestStatus: this.requestStatus.progress,
    urlResult: [],
    searchInput: '',
  }

  componentDidMount() {
    const {searchInput} = this.context
    console.log(searchInput)
    this.getSearchResults(searchInput)
  }

  componentDidUpdate(prevProps, prevState) {
    const {searchInput} = this.context
    const {urlRequestStatus} = this.state

    if (
      prevState.searchInput !== searchInput &&
      urlRequestStatus !== this.requestStatus.progress
    ) {
      this.getSearchResults(searchInput)
    }
  }

  getSearchResults = async searchInput => {
    this.setState({urlRequestStatus: this.requestStatus.progress, searchInput})
    const url = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
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

  getCorrespondingLandscapeView = (activeTheme, changeCurrentTab) => {
    const {urlRequestStatus, urlResult, searchInput} = this.state
    const fontColor = activeTheme === 'Dark' ? 'dark-color' : 'light-color'
    const iconColor = activeTheme === 'Dark' ? '#ffffff' : '#000000'
    const shadowColor = activeTheme === 'Dark' ? '#333' : '#888888'
    const postBackColor =
      activeTheme === 'Dark' ? 'post-dark-background' : 'post-light-background'
    switch (urlRequestStatus) {
      case this.requestStatus.progress:
        return (
          <div className="loader-container" testid="loader">
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
            <p>Something went wrong. Please try again</p>
            <button
              type="button"
              onClick={() => {
                this.getSearchResults(searchInput)
              }}
              className="try-again-button"
            >
              Try again
            </button>
          </div>
        )
      case this.requestStatus.success:
        return (
          <div>
            <h1 className="search-results-text">Search Results</h1>
            {urlResult.length !== 0 ? (
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
                        to={`/users/${eachPost.userId}`}
                        className={`username-link ${fontColor}`}
                        onClick={() => changeCurrentTab('userProfile')}
                      >
                        <p>{eachPost.userName} </p>
                      </Link>
                    </div>
                    <img
                      src={eachPost.postDetails.image_url}
                      alt="post"
                      className="post-image"
                    />
                    <div className="likes-comment-container">
                      {!eachPost.like_status ? (
                        <button
                          type="button"
                          label="likeIcon"
                          testid="likeIcon"
                          className="like-button"
                          onClick={() => this.postLiked(eachPost.postId)}
                        >
                          <BsHeart
                            color={`${iconColor}`}
                            style={{
                              marginRight: '10px',
                              height: '20px',
                              width: '20px',
                            }}
                          />
                        </button>
                      ) : (
                        <button
                          type="button"
                          label="unLikeIconv"
                          testid="unLikeIcon"
                          className="like-button"
                          onClick={() => this.postUnLiked(eachPost.postId)}
                        >
                          <FcLike
                            style={{
                              marginRight: '10px',
                              height: '20px',
                              width: '20px',
                            }}
                          />
                        </button>
                      )}
                      <FaRegComment style={{marginRight: '10px'}} />
                      <BiShareAlt style={{marginRight: '10px'}} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                      }}
                    >
                      <p>{eachPost.likesCount}</p>
                      <p style={{marginLeft: '5px'}}>likes</p>
                    </div>
                    <p>{eachPost.postDetails.caption}</p>
                    <ul className="unordered-comment-list">
                      {eachPost.comments.map(eachComment => (
                        <li
                          key={eachComment.user_id}
                          className="comment-list-item"
                        >
                          <span style={{fontWeight: 'bold'}}>
                            {eachComment.user_name}
                          </span>
                          <p style={{marginLeft: '5px'}}>
                            {eachComment.comment}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <p style={{color: 'gray'}}>{eachPost.createdAt}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="search-not-found-container">
                <img
                  src="https://res.cloudinary.com/djfbwkdh3/image/upload/v1705733745/Group_lv25h8.png"
                  alt="search not found"
                  className="no-search-results-image"
                />
                <h1>Search Not Found</h1>
                <p>Try different keyword or search again</p>
              </div>
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
          const {activeTheme, buttonClicked, changeCurrentTab} = value
          return (
            <>
              <div className="search-container-landscape">
                {this.getCorrespondingLandscapeView(
                  activeTheme,
                  changeCurrentTab,
                )}
              </div>
              <div className="search-container-portrait">
                {buttonClicked === 0 ? (
                  <div className="portrait-search-default-container">
                    <GrSearchAdvanced />
                    <p>Search Results will be appear here</p>
                  </div>
                ) : (
                  <div>
                    {this.getCorrespondingLandscapeView(
                      activeTheme,
                      changeCurrentTab,
                    )}
                  </div>
                )}
              </div>
            </>
          )
        }}
      </ThemeContext.Consumer>
    )
  }
}

Search.contextType = ThemeContext

export default Search
