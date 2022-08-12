import {Component} from 'react'
import {Link} from 'react-router-dom'

import {BsSearch} from 'react-icons/bs'
import {FcGenericSortingAsc, FcGenericSortingDesc} from 'react-icons/fc'
import {BiChevronRightSquare} from 'react-icons/bi'

import Loader from 'react-loader-spinner'
import statesList from './fixtureData'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const appConstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    resultList: [],
    appStatus: appConstants.initial,
    searchInput: '',
    searchList: [],
  }

  componentDidMount() {
    this.getData()
  }

  componentWillUnmount() {}

  getData = () => {
    this.setState(
      {appStatus: appConstants.progress},
      this.getCountryWideDetails,
    )
  }

  getCountryWideDetails = async () => {
    const url = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const newData = this.convertObjectsDataIntoListItemsUsingForInMethod(data)
      this.setState({resultList: newData, appStatus: appConstants.success})
    }
  }

  convertObjectsDataIntoListItemsUsingForInMethod = data => {
    const resultList = []
    const keyNames = Object.keys(data)

    keyNames.forEach(keyName => {
      if (data[keyName]) {
        const {total} = data[keyName]
        const confirmed = total.confirmed ? total.confirmed : 0
        const deceased = total.deceased ? total.deceased : 0
        const recovered = total.recovered ? total.recovered : 0
        const tested = total.tested ? total.tested : 0
        const population = data[keyName].meta.population
          ? data[keyName].meta.population
          : 0
        let name
        try {
          name = statesList.find(state => state.state_code === keyName)
            .state_name
        } catch (err) {
          name = ''
        }
        resultList.push({
          stateCode: keyName,
          name,
          confirmed,
          deceased,
          recovered,
          tested,
          population,
          active: confirmed - (deceased + recovered),
        })
      }
    })
    return resultList
  }

  sortList = () => {
    const {resultList} = this.state
    const sortedList = resultList.sort()
    this.setState({resultList: sortedList})
  }

  reverseList = () => {
    const {resultList} = this.state
    const sortedList = resultList.sort().reverse()
    this.setState({resultList: sortedList})
  }

  setInput = e => {
    const updatedSearchList = statesList.filter(eachValue =>
      eachValue.state_name.toUpperCase().includes(e.target.value.toUpperCase()),
    )
    this.setState({searchInput: e.target.value, searchList: updatedSearchList})
  }

  getTable = () => {
    const {resultList} = this.state
    const updatedList = resultList.filter(eachItem => eachItem.name !== '')

    return (
      <div testid="stateWiseCovidDataTable" className="state-table">
        <div className="state-result-heading">
          <div className="state-ul-holder">
            <p className="first-column-title">States/UT</p>
            <button
              type="button"
              className="icon-button"
              onClick={this.sortList}
              testid="ascendingSort"
            >
              <FcGenericSortingAsc className="ascending-icon" />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={this.reverseList}
              testid="descendingSort"
            >
              <FcGenericSortingDesc className="descending-icon" />
            </button>
          </div>
          <p className="general-column-title">Confirmed</p>
          <p className="general-column-title">Active</p>
          <p className="general-column-title">Recovered</p>
          <p className="general-column-title">Deceased</p>
          <p className="general-column-title">Population</p>
        </div>
        <ul className="state-result-table">
          {updatedList.map(eachValue => (
            <li className="state-result-row" key={eachValue.state_code}>
              <Link
                to={`/state/${eachValue.stateCode}`}
                className="state-link-item"
              >
                <p className="name-column">{eachValue.name}</p>
              </Link>
              <p className="number-column confirmed">{eachValue.confirmed}</p>
              <p className="number-column active">{eachValue.active}</p>
              <p className="number-column recovered">{eachValue.recovered}</p>
              <p className="number-column deceased">{eachValue.deceased}</p>
              <p className="number-column population">{eachValue.population}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  homeView = () => {
    const {resultList, searchInput, searchList} = this.state
    const totalCases = resultList.filter(eachItem => eachItem.name === '')
    const {confirmed, active, recovered, deceased} = totalCases[0]
    return (
      <div className="home-middle-container">
        <div className="searchbar-holder">
          <BsSearch className="search-icon" />
          <input
            type="search"
            className="searchbar-input"
            placeholder="Enter the State"
            value={searchInput}
            onChange={this.setInput}
          />
        </div>
        {searchInput !== '' && searchList.length !== 0 ? (
          <ul className="search-container" testid="searchResultsUnorderedList">
            {searchList.map(eachValue => (
              <Link
                to={`/state/${eachValue.state_code}`}
                className="search-link"
              >
                <li className="search-list-item" key={eachValue.state_code}>
                  <p className="item-name">{eachValue.state_name}</p>
                  <div className="icon-container">
                    <p className="item-code">{eachValue.state_code}</p>
                    <BiChevronRightSquare color="#FACC15" />
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          searchInput !== '' && (
            <div>
              <h3 className="no-results">No Results Found</h3>
            </div>
          )
        )}
        <div className="home-result-container">
          <div className="home-top-list">
            <div
              className="list-item confirmed"
              testid="countryWideConfirmedCases"
            >
              <p>Confirmed</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641905267/confirmed_qmelok.svg"
                className="dashboard-item"
                alt="country wide confirmed cases pic"
              />
              <p>{confirmed}</p>
            </div>
            <div className="list-item active" testid="countryWideActiveCases">
              <p>Active</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641908440/active_tmhkjf.svg"
                className="dashboard-item"
                alt="country wide recovered cases pic"
              />
              <p>{active}</p>
            </div>
            <div
              className="list-item recovered"
              testid="countryWideRecoveredCases"
            >
              <p>Recovered</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641909310/recovered_dtfpwl.svg"
                className="dashboard-item"
                alt="country wide active cases pic"
              />
              <p>{recovered}</p>
            </div>
            <div
              className="list-item  deceased"
              testid="countryWideDeceasedCases"
            >
              <p>Deceased</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641909662/deceased_tskayc.svg"
                className="dashboard-item"
                alt="country wide deceased cases pic"
              />
              <p>{deceased}</p>
            </div>
          </div>
          <div className="table-container"> {this.getTable()}</div>
        </div>
        <Footer />
      </div>
    )
  }

  loadingView = () => (
    <div testid="homeRouteLoader" className="loader-container">
      <Loader type="TailSpin" color="#007BFF" width="25px" height="25px" />
    </div>
  )

  checkCondition = () => {
    const {appStatus} = this.state
    switch (appStatus) {
      case appConstants.success:
        return this.homeView()
      default:
        return this.loadingView()
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.checkCondition()}
      </>
    )
  }
}

export default Home
