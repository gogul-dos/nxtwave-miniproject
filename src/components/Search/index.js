import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment, FaSearch} from 'react-icons/fa'
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
    portraitSearchInput: '',
    searchButtonClicked: 0,
  }

  componentDidMount() {
    const {searchInput} = this.context
    console.log(searchInput)
    console.log('Hii')
    this.getSearchResults(searchInput)
  }

  componentDidUpdate(prevProps, prevState) {
    const {searchInput} = this.context
    const {urlRequestStatus} = this.state

    // Check if searchInput has changed and if the component is not already in the process of fetching data
    if (
      prevState.searchInput !== searchInput &&
      urlRequestStatus !== this.requestStatus.progress
    ) {
      // Trigger asynchronous operation when searchInput changes
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
              alt="failure"
              className="failure-image"
            />
            <h1>Something went wrong. Please try again</h1>
            <button type="button" className="try-again-button">
              Try Again
            </button>
          </div>
        )
      case this.requestStatus.success:
        return (
          <div>
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
                        to={`/user-profile/${eachPost.userId}`}
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
                      {!eachPost.like_status && (
                        <button
                          type="button"
                          label="likeIcon"
                          data-testid="likeIcon"
                          className="like-button"
                        >
                          <BsHeart
                            color={`${iconColor}`}
                            style={{marginRight: '10px'}}
                            onClick={() => this.postLiked(eachPost.postId)}
                          />
                        </button>
                      )}
                      {eachPost.like_status && (
                        <button
                          type="button"
                          label="likeIcon"
                          data-testid="likeIcon"
                          className="like-button"
                        >
                          <FcLike
                            style={{marginRight: '10px'}}
                            onClick={() => this.postUnLiked(eachPost.postId)}
                          />
                        </button>
                      )}
                      <FaRegComment style={{marginRight: '10px'}} />
                      <BiShareAlt style={{marginRight: '10px'}} />
                    </div>
                    <p style={{fontWeight: 'bold'}}>
                      {eachPost.likesCount} likes
                    </p>
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

  inputChangedPortrait = () => {
    const input = document.getElementById('portraitSearch').value
    const {searchButtonClicked} = this.state
    if (input === '') {
      this.setState({
        portraitSearchInput: input,
        searchButtonClicked: 0,
      })
    } else {
      this.setState({
        portraitSearchInput: input,
        searchButtonClicked: searchButtonClicked + 1,
      })
    }
    this.getSearchResults(input)
  }

  render() {
    const {portraitSearchInput, searchButtonClicked} = this.state
    return (
      <ThemeContext.Consumer>
        {value => {
          const {activeTheme, changeCurrentTab, changeSearchInput} = value
          return (
            <>
              <div className="search-container-landscape">
                <h1 style={{marginLeft: '15px'}}>Search Results</h1>
                {this.getCorrespondingLandscapeView(activeTheme)}
              </div>
              <div className="search-container-portrait">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <input
                      type="search"
                      className="search-element"
                      placeholder="Search Caption"
                      id="portraitSearch"
                    />

                    <button
                      type="button"
                      label="search"
                      data-testid="searchIcon"
                      className="search-icon-container"
                      onClick={() => {
                        changeCurrentTab('Search')
                        changeSearchInput(portraitSearchInput)
                        this.inputChangedPortrait()
                      }}
                    >
                      <FaSearch style={{height: '15px', width: '15px'}} />
                    </button>
                  </div>
                </div>
                {portraitSearchInput === '' && searchButtonClicked === 0 ? (
                  <div className="portrait-search-default-container">
                    <GrSearchAdvanced />
                    <p>Search Results will be appear here</p>
                  </div>
                ) : (
                  <div>{this.getCorrespondingLandscapeView(activeTheme)}</div>
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
