import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import style from './style.scss'
import debounce from 'lodash/debounce'
import { actionCreator/* , viewGenerator */ } from '@/utils/fetchGenerator'
import { API_SEARCH } from '@/constants'
import { pageName } from '@/pages/SearchPage'
import { moduleName } from '@/pages/SearchPage/content'

const SearchPreviewItem = ({ item }) => {
  return (
    <Link to={`/subject/${item.id}`}>
      <div className={style.searchPreviewItem} key={item.id}>
        <img src={item.images.large} className={style.previewImg} />
        <div className={style.previewInfo}>
          <div className={style.previewItemTitle}>{item.title}</div>
          <div className={style.previewItemYear}>{item.year}</div>
          <div className={style.previewItemOriginalTitle}>{item.original_title}</div>
        </div>
      </div>
    </Link>
  )
}

class SearchPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isHidden: false,
      bodyClickHandler: () => {
        this.setState({
          isHidden: true
        })
      },
      selfClickHandler: (e) => {
        e.stopPropagation()
      }
    }
  }

  componentDidMount = () => {
    document.body.addEventListener('click', this.state.bodyClickHandler)
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.isAbleToShowPreview()) {
      this.setState({
        isHidden: false
      })
    }
  }

  componentWillUnmount = () => {
    document.body.removeEventListener('click', this.state.bodyClickHandler)
    // this.previewNode.removeEventListener('click', this.state.selfClickHandler) // TODO: ref and cwu
  }

  isAbleToShowPreview() {
    return this.state.isHidden ||
        this.props.data.isLoading === true ||
        Object.prototype.toString.call(this.props.data.isLoading) === '[object Undefined]'
  }

  render() {
    if (this.isAbleToShowPreview()) {
      return null
    }
    let subjects = this.props.data.payload.subjects
    return (
      <div className={style.searchPreviewWrapper} ref={(preview) => { this.previewNode = preview }}>
        {subjects.slice(0, 6).map(item => {
          return (
            <SearchPreviewItem item={item} key={item.id} />
          )
        })}
      </div>
    )
  }
}

class NavBar extends Component {
  searchQuery = (value) => {
    this.props.fetchQuery(value)
  }

  deboncedSearch = debounce(this.searchQuery, 300)

  render() {
    return (
      <div>
        <div className={style.globalNavItems} >
          <Link to={'/'} >??????</Link>
          <a>??????</a>
          <a>??????</a>
          <a>??????</a>
        </div>
        <div className={style.movieNav}>
          <div className={style.titleAndSearchWrapper}>
            <div className={style.titleAndSearch}>
              <Link className={style.title} to={'/'}>
                ????????????
              </Link>
              <div className={style.searchBarWrapper}>
                <Input.Search
                  placeholder="??????????????????????????????????????????"
                  className={style.searchBar}
                  onChange={(e) => { // TODO: ???????????????e
                    this.deboncedSearch(e.target.value)
                  }
                  }
                  onSearch={
                    (value) => {
                      this.props.history.location.pathname = `/`
                      this.props.history.push(`search?q=${value}`)
                    }
                  }
                />
                {

                  <SearchPreview data={this.props.searchPreview} />
                }
              </div>
            </div>
          </div>
          <div className={style.movieCateNavWrapper}>
            <div className={style.movieCateNav}>
              <Link to="/cinema">??????&??????</Link>
              <Link to="/chart">?????????</Link>
              <Link to="/tag?q=??????">??????</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

let mapStateToProps = (state, ownProps) => {
  return {
    searchPreview: state[pageName][moduleName]
  }
}

let mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchQuery: (query) => {
      let queryURL = API_SEARCH.replace(/:query/, query)
      let ac = actionCreator({ pageName, moduleName, URL: queryURL })
      ac(dispatch)
    }
  }
}

let connected = connect(mapStateToProps, mapDispatchToProps)(NavBar)
export default withRouter(connected)