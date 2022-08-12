import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {LineChart, XAxis, YAxis, Tooltip, Line, BarChart, Bar} from 'recharts'

import Header from '../Header'

import Footer from '../Footer'

import statesList from '../Home/fixtureData'
import './index.css'

const appConstants = {
  initial: 'INITIAL',
  progress: 'PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const cardConstants = {
  confirmed: 'CONFIRMED',
  active: 'ACTIVE',
  recovered: 'RECOVERED',
  deceased: 'DECEASED',
}

const trendStatus = {
  cumulative: 'CUMULATIVE',
  daily: 'DAILY',
}

let lineChartData = {}

let districtNames = {}

class StateSpecific extends Component {
  state = {
    requiredBasicDetails: [],
    cardStatus: cardConstants.confirmed,
    appStatus1: appConstants.initial,
    appStatus2: appConstants.initial,
    timeLineData: [],
    trendState: trendStatus.cumulative,
    selectValue: 'Select District',
  }

  componentDidMount() {
    this.setState({appStatus1: appConstants.progress}, this.getStateDetails)
    this.setState({appStatus2: appConstants.progress}, this.getTimeLineDetails)
  }

  startFetching = () => {
    const {history} = this.props
    history.replace('/')
  }

  changeDateFormat = dateValue => {
    const lastIndexValue = dateValue.slice(dateValue.length - 1)
    switch (lastIndexValue) {
      case '1':
        return lastIndexValue.concat('st')
      case '2':
        return lastIndexValue.concat('nd')

      case '3':
        return lastIndexValue.concat('rd')
      default:
        return lastIndexValue.concat('th')
    }
  }

  getStateDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const id = stateCode
    const url = 'https://apis.ccbp.in/covid19-state-wise-data'
    const response = await fetch(url)
    const data = await response.json()
    const codeList = statesList.map(eachValue => eachValue.state_code)
    if (!codeList.includes(id)) {
      const {history} = this.props
      history.replace('/not-found')
    }
    if (response.ok) {
      const newData = {
        confirmed: data[id].total.confirmed,
        recovered: data[id].total.recovered,
        deceased: data[id].total.deceased,
        population: data[id].meta.population,
        active:
          data[id].total.confirmed -
          (data[id].total.recovered + data[id].total.deceased),
        idValue: id,
        name: statesList.find(eachValue => eachValue.state_code === id)
          .state_name,
        districts: data[id].districts,
        tested: data[id].total.tested,
        lastUpdated: data[id].meta.last_updated,
        imageUrl: statesList.find(eachValue => eachValue.state_code === id)
          .image_url,
      }
      this.setState({
        requiredBasicDetails: newData,
        appStatus1: appConstants.success,
      })
    }
  }

  getTimeLineDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {stateCode} = params
    const url = `https://apis.ccbp.in/covid19-timelines-data/${stateCode}`
    const response = await fetch(url)
    const data = await response.json()
    const codeList = statesList.map(eachValue => eachValue.state_code)
    if (!codeList.includes(stateCode)) {
      const {history} = this.props
      history.replace('/not-found')
    }
    if (response.ok) {
      districtNames = data[`${stateCode}`].districts
      const newData = data[`${stateCode}`].dates
      this.setState({timeLineData: newData, appStatus2: appConstants.success})
    }
  }

  descendingList = newDistricts => {
    const newDistrictsList = newDistricts.sort().reverse()
    return newDistrictsList
  }

  onCardClick = cardState => this.setState({cardStatus: cardState})

  getDistrictValues = () => {
    const {requiredBasicDetails, cardStatus} = this.state
    const {districts} = requiredBasicDetails
    const newDistricts = []
    switch (cardStatus) {
      case cardConstants.confirmed:
        Object.keys(districts).forEach(key =>
          newDistricts.push({
            name: key,
            value:
              districts[key].total.confirmed === undefined
                ? 0
                : districts[key].total.confirmed,
          }),
        )
        return this.descendingList(newDistricts)
      case cardConstants.deceased:
        Object.keys(districts).forEach(key =>
          newDistricts.push({
            name: key,
            value:
              districts[key].total.deceased === undefined
                ? 0
                : districts[key].total.deceased,
          }),
        )
        return this.descendingList(newDistricts)
      case cardConstants.recovered:
        Object.keys(districts).forEach(key =>
          newDistricts.push({
            name: key,
            value:
              districts[key].total.recovered === undefined
                ? 0
                : districts[key].total.recovered,
          }),
        )
        return this.descendingList(newDistricts)
      default:
        Object.keys(districts).forEach(key =>
          newDistricts.push({
            name: key,
            value:
              (districts[key].total.confirmed === undefined
                ? 0
                : districts[key].total.confirmed) -
              ((districts[key].total.deceased === undefined
                ? 0
                : districts[key].total.deceased) +
                (districts[key].total.recovered === undefined
                  ? 0
                  : districts[key].total.recovered)),
          }),
        )
        return this.descendingList(newDistricts)
    }
  }

  stateSuccessContainer = () => {
    const {requiredBasicDetails, cardStatus} = this.state
    const confirmedCardClassName =
      cardStatus === cardConstants.confirmed
        ? 'card-list-item card-red'
        : 'card-list-item'
    const activeCardClassName =
      cardStatus === cardConstants.active
        ? 'card-list-item card-blue'
        : 'card-list-item'
    const recoveredCardClassName =
      cardStatus === cardConstants.recovered
        ? 'card-list-item card-green'
        : 'card-list-item'
    const deceasedCardClassName =
      cardStatus === cardConstants.deceased
        ? 'card-list-item card-grey'
        : 'card-list-item'

    let districtValue = []
    if (requiredBasicDetails.length !== 0) {
      districtValue = this.getDistrictValues()
    }
    return (
      <div className="state-content-container">
        <div className="top-container">
          <div className="state-name-container">
            <h1 className="state-name">{requiredBasicDetails.name}</h1>
          </div>
          <div className="top-second-half-container">
            <p className="tested-name">Tested</p>
            <p className="tested-result">{requiredBasicDetails.tested}</p>
          </div>
        </div>
        <p className="last-updated-para">
          Last update on {requiredBasicDetails.lastUpdated}.
        </p>
        <ul className="state-specific-card-list">
          <li className={confirmedCardClassName}>
            <button
              type="button"
              className="card-list-button"
              onClick={() => this.onCardClick(cardConstants.confirmed)}
              testid="stateSpecificConfirmedCasesContainer"
            >
              <p className="confirm-card-name">Confirmed</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641905267/confirmed_qmelok.svg"
                className="confirm-card-image"
                alt="state specific confirmed cases pic"
              />
              <p className="confirm-card-number">
                {requiredBasicDetails.confirmed}
              </p>
            </button>
          </li>
          <li className={activeCardClassName}>
            <button
              type="button"
              className="card-list-button"
              onClick={() => this.onCardClick(cardConstants.active)}
              testid="stateSpecificActiveCasesContainer"
            >
              <p className="active-card-name">Active</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641908440/active_tmhkjf.svg"
                className="active-card-image"
                alt="state specific active cases pic"
              />
              <p className="active-card-number">
                {requiredBasicDetails.active}
              </p>
            </button>
          </li>
          <li className={recoveredCardClassName}>
            <button
              type="button"
              className="card-list-button"
              onClick={() => this.onCardClick(cardConstants.recovered)}
              testid="stateSpecificRecoveredCasesContainer"
            >
              <p className="recovered-card-name">Recovered</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641909310/recovered_dtfpwl.svg"
                className="recovered-card-image"
                alt="state specific recovered cases pic"
              />
              <p className="recovered-card-number">
                {requiredBasicDetails.recovered}
              </p>
            </button>
          </li>
          <li className={deceasedCardClassName}>
            <button
              type="button"
              className="card-list-button"
              onClick={() => this.onCardClick(cardConstants.deceased)}
              testid="stateSpecificDeceasedCasesContainer"
            >
              <p className="deceased-card-name">Deceased</p>
              <img
                src="https://res.cloudinary.com/dyhsyterg/image/upload/v1641909662/deceased_tskayc.svg"
                className="deceased-card-image"
                alt="state specific deceased cases pic"
              />
              <p className="deceased-card-number">
                {requiredBasicDetails.deceased}
              </p>
            </button>
          </li>
        </ul>

        <div className="image-container">
          <img
            className="state-image"
            src={requiredBasicDetails.imageUrl}
            alt={requiredBasicDetails.idValue}
          />
          <div className="image-content">
            <p className="ncp-report">NCP report</p>
            <p className="population-heading">Population</p>
            <p className="content-numbers">{requiredBasicDetails.population}</p>
            <p className="population-heading">Tested</p>
            <p className="content-numbers">{requiredBasicDetails.tested}</p>
          </div>
        </div>

        <h1 className="top-districts">Top Districts</h1>
        <ul testid="topDistrictsUnorderedList" className="top-districts-list">
          {districtValue.map(eachValue => (
            <li className="top-districts-list-item" key={eachValue.name}>
              <p className="top-districts-name">{eachValue.value}</p>
              <p className="top-districts-number">{eachValue.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  stateLoaderContainer = () => (
    <div testid="stateDetailsLoader" className="state-loader-container">
      <Loader type="TailSpin" color="#007BFF" width="25px" height="25px" />
    </div>
  )

  timeLineLoaderContainer = () => (
    <div testid="timelinesDataLoader" className="state-loader-container">
      <Loader type="TailSpin" color="#007BFF" width="25px" height="25px" />
    </div>
  )

  stateContentStatus = () => {
    const {appStatus1} = this.state
    switch (appStatus1) {
      case appConstants.success:
        return this.stateSuccessContainer()

      default:
        return this.stateLoaderContainer()
    }
  }

  timeLineContentStatus = () => {
    const {appStatus2} = this.state
    switch (appStatus2) {
      case appConstants.success:
        return this.timeLineSuccessContainer()

      default:
        return this.timeLineLoaderContainer()
    }
  }

  getDateForBarChart = key => {
    const date = new Date(key)
    const newDate = date.toLocaleDateString('en-us', {
      month: 'short',
      day: '2-digit',
    })
    const dateList = newDate.split(' ')
    const dateFormat = []
    dateFormat.push(dateList[1])
    dateFormat.push(dateList[0].toUpperCase())
    const result = dateFormat.join(' ')
    return result
  }

  getTimeLineChartValues = () => {
    const {timeLineData, cardStatus} = this.state
    const newTimeLineData = []
    switch (cardStatus) {
      case cardConstants.confirmed:
        Object.keys(timeLineData).forEach(key =>
          newTimeLineData.push({
            date: this.getDateForBarChart(key),
            number: timeLineData[key].total.confirmed,
          }),
        )
        return newTimeLineData
      case cardConstants.deceased:
        Object.keys(timeLineData).forEach(key =>
          newTimeLineData.push({
            date: this.getDateForBarChart(key),
            number: timeLineData[key].total.deceased,
          }),
        )
        return newTimeLineData
      case cardConstants.recovered:
        Object.keys(timeLineData).forEach(key =>
          newTimeLineData.push({
            date: this.getDateForBarChart(key),
            number: timeLineData[key].total.recovered,
          }),
        )
        return newTimeLineData
      default:
        Object.keys(timeLineData).forEach(key =>
          newTimeLineData.push({
            date: this.getDateForBarChart(key),
            number:
              (timeLineData[key].total.confirmed === undefined
                ? 0
                : timeLineData[key].total.confirmed) -
              ((timeLineData[key].total.deceased === undefined
                ? 0
                : timeLineData[key].total.deceased) +
                (timeLineData[key].total.recovered === undefined
                  ? 0
                  : timeLineData[key].total.recovered)),
          }),
        )
        return newTimeLineData
    }
  }

  getLineChartData = () => {
    const {selectValue, trendState} = this.state
    let {timeLineData} = this.state
    if (selectValue !== 'Select District') {
      timeLineData = districtNames[selectValue].dates
    }
    const confirmedData = []
    Object.keys(timeLineData).forEach(key =>
      confirmedData.push({
        date: key,
        number:
          timeLineData[key].total.confirmed === undefined
            ? 0
            : timeLineData[key].total.confirmed,
      }),
    )
    const activeData = []
    Object.keys(timeLineData).forEach(key =>
      activeData.push({
        date: key,
        number:
          (timeLineData[key].total.confirmed === undefined
            ? 0
            : timeLineData[key].total.confirmed) -
          ((timeLineData[key].total.deceased === undefined
            ? 0
            : timeLineData[key].total.deceased) +
            (timeLineData[key].total.recovered === undefined
              ? 0
              : timeLineData[key].total.recovered)),
      }),
    )
    const recoveredData = []
    Object.keys(timeLineData).forEach(key =>
      recoveredData.push({
        date: key,
        number:
          timeLineData[key].total.recovered === undefined
            ? 0
            : timeLineData[key].total.recovered,
      }),
    )
    const deceasedData = []
    Object.keys(timeLineData).forEach(key =>
      deceasedData.push({
        date: key,
        number:
          timeLineData[key].total.deceased === undefined
            ? 0
            : timeLineData[key].total.deceased,
      }),
    )
    const testedData = []
    Object.keys(timeLineData).forEach(key =>
      testedData.push({
        date: key,
        number:
          timeLineData[key].total.tested === undefined
            ? 0
            : timeLineData[key].total.tested,
      }),
    )
    lineChartData = {
      confirmed: confirmedData,
      active: activeData,
      recovered: recoveredData,
      deceased: deceasedData,
      tested: testedData,
    }

    if (trendState === trendStatus.daily) {
      let refValue = 0
      const newConfirmedData = confirmedData.map(eachValue => {
        let newValue = 0
        newValue = eachValue.number - refValue
        refValue = eachValue.number
        return {
          date: eachValue.date,
          number: newValue,
        }
      })
      refValue = 0
      const newRecoveredData = recoveredData.map(eachValue => {
        let newValue = 0
        newValue = eachValue.number - refValue
        refValue = eachValue.number
        return {
          date: eachValue.date,
          number: newValue,
        }
      })
      refValue = 0
      const newDeceasedData = deceasedData.map(eachValue => {
        let newValue = 0
        newValue = eachValue.number - refValue
        refValue = eachValue.number
        return {
          date: eachValue.date,
          number: newValue,
        }
      })
      refValue = 0
      const newActiveData = activeData.map(eachValue => {
        let newValue = 0
        if (eachValue.number > refValue) {
          newValue = eachValue.number - refValue
          refValue = eachValue.number
        }
        refValue = eachValue.number
        return {
          date: eachValue.date,
          number: newValue,
        }
      })
      refValue = 0
      const newTestedData = testedData.map(eachValue => {
        let newValue = 0
        newValue = eachValue.number - refValue
        refValue = eachValue.number
        return {
          date: eachValue.date,
          number: newValue,
        }
      })
      newConfirmedData.splice(0, 1)
      newActiveData.splice(0, 1)
      newRecoveredData.splice(0, 1)
      newDeceasedData.splice(0, 1)
      newTestedData.splice(0, 1)
      lineChartData = {
        confirmed: newConfirmedData,
        active: newActiveData,
        recovered: newRecoveredData,
        deceased: newDeceasedData,
        tested: newTestedData,
      }
    }
  }

  selectChange = e => {
    this.setState({selectValue: e.target.value}, this.getLineChartData)
  }

  trendChange = value => {
    this.setState({trendState: value})
  }

  timeLineSuccessContainer = () => {
    const {timeLineData, cardStatus, trendState, selectValue} = this.state

    let newTimeLineData = []
    if (timeLineData.length !== 0) {
      newTimeLineData = this.getTimeLineChartValues()
      newTimeLineData = newTimeLineData.slice(-10)
    }
    let colorValue = '#9A0E31'
    switch (cardStatus) {
      case cardConstants.active:
        colorValue = '#0A4FA0'
        break
      case cardConstants.recovered:
        colorValue = '#216837'
        break
      case cardConstants.deceased:
        colorValue = '#474C57'
        break
      default:
        colorValue = '#9A0E31'
        break
    }
    this.getLineChartData()
    const daily =
      trendState === trendStatus.daily
        ? 'trend-button highlight-trend'
        : 'trend-button'
    const cumulative =
      trendState === trendStatus.cumulative
        ? 'trend-button highlight-trend'
        : 'trend-button'
    const selectOptions = Object.keys(districtNames)

    return (
      <div testid="lineChartsContainer" className="graphs-container">
        <div className="graphs-lg">
          <div className="bar-chart-lg">
            <BarChart
              width={700}
              height={240}
              barSize={35}
              data={newTimeLineData}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                interval={0}
                fontSize={10}
                tickLine={0}
                tick={{fill: colorValue, strokeWidth: 1}}
              />
              <Bar
                dataKey="number"
                fill={colorValue}
                radius={[5, 5, 0, 0]}
                label={{
                  position: 'top',
                  fill: colorValue,
                  fontSize: 10,
                }}
              />
            </BarChart>
          </div>
          <h1 className="daily-spread-trends">Spread Trends</h1>
          <div className="trend-holder">
            <button
              type="button"
              className={cumulative}
              onClick={() => this.trendChange(trendStatus.cumulative)}
            >
              Cumulative
            </button>
            <button
              type="button"
              className={daily}
              onClick={() => this.trendChange(trendStatus.daily)}
            >
              Daily
            </button>
          </div>
          <div className="select-container">
            <select
              value={selectValue}
              className="select-element"
              onChange={this.selectChange}
            >
              <option value="Select District">Select District</option>
              {selectOptions.map(eachValue => (
                <option key={eachValue} value={eachValue}>
                  {eachValue}
                </option>
              ))}
            </select>
          </div>
          <div className="line-chart-lg">
            <div className="confirmed-chart">
              <p className="confirmed-title">Confirmed</p>
              <LineChart
                width={730}
                height={200}
                data={lineChartData.confirmed}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={10}
                  tick={{fill: '#FF073A', strokeWidth: 1}}
                />
                <YAxis fontSize={10} tick={{fill: '#FF073A', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#FF073A"
                  strokeWidth={2}
                  dot={{
                    fill: '#FF073A',
                  }}
                />
              </LineChart>
            </div>
            <div className="active-chart">
              <p className="active-title">Total Active</p>
              <LineChart
                width={730}
                height={200}
                data={lineChartData.active}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={10}
                  tick={{fill: '#007BFF', strokeWidth: 1}}
                />
                <YAxis fontSize={10} tick={{fill: '#007BFF', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#007BFF"
                  strokeWidth={2}
                  dot={{
                    fill: '#007BFF',
                  }}
                />
              </LineChart>
            </div>
            <div className="recovered-chart">
              <p className="recovered-title">Recovered</p>
              <LineChart
                width={730}
                height={200}
                data={lineChartData.recovered}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={10}
                  tick={{fill: '#27A243', strokeWidth: 1}}
                />
                <YAxis fontSize={10} tick={{fill: '#27A243', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#27A243"
                  strokeWidth={2}
                  dot={{
                    fill: '#27A243',
                  }}
                />
              </LineChart>
            </div>
            <div className="deceased-chart">
              <p className="deceased-title">Deceased</p>
              <LineChart
                width={730}
                height={200}
                data={lineChartData.deceased}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={10}
                  tick={{fill: '#6C757D', strokeWidth: 1}}
                />
                <YAxis fontSize={10} tick={{fill: '#6C757D', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#6C757D"
                  strokeWidth={2}
                  dot={{
                    fill: '#6C757D',
                  }}
                />
              </LineChart>
            </div>
            <div className="tested-chart">
              <p className="tested-title">Tested</p>
              <LineChart
                width={730}
                height={200}
                data={lineChartData.tested}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={10}
                  tick={{fill: '#9673B9', strokeWidth: 1}}
                />
                <YAxis fontSize={10} tick={{fill: '#9673B9', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#9673B9"
                  strokeWidth={2}
                  dot={{
                    fill: '#9673B9',
                  }}
                />
              </LineChart>
            </div>
          </div>
        </div>
        <div className="graphs-sm">
          <div className="bar-chart-sm">
            <BarChart
              width={350}
              height={140}
              barSize={16}
              data={newTimeLineData}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                interval={0}
                fontSize={6}
                tickLine={0}
                tick={{fill: colorValue, strokeWidth: 1}}
              />
              <Bar
                dataKey="number"
                fill={colorValue}
                radius={[3, 3, 0, 0]}
                label={{
                  position: 'top',
                  fill: colorValue,
                  fontSize: 6,
                }}
              />
            </BarChart>
          </div>
          <h1 className="daily-spread-trends">Daily Spread Trends</h1>
          <div className="trend-holder">
            <button
              type="button"
              className={cumulative}
              onClick={() => this.trendChange(trendStatus.cumulative)}
            >
              Cumulative
            </button>
            <button
              type="button"
              className={daily}
              onClick={() => this.trendChange(trendStatus.daily)}
            >
              Daily
            </button>
          </div>
          <div className="select-container">
            <select
              value={selectValue}
              className="select-element"
              onChange={this.selectChange}
            >
              <option value="Select District">Select District</option>
              {selectOptions.map(eachValue => (
                <option key={eachValue} value={eachValue}>
                  {eachValue}
                </option>
              ))}
            </select>
          </div>
          <div className="line-chart-sm">
            <div className="confirmed-chart">
              <p className="confirmed-title">Confirmed</p>
              <LineChart
                width={410}
                height={160}
                data={lineChartData.confirmed}
                margin={{top: 5, right: 60, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={6}
                  tick={{fill: '#FF073A', strokeWidth: 1}}
                />
                <YAxis fontSize={6} tick={{fill: '#FF073A', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#FF073A"
                  strokeWidth={1}
                  dot={{
                    fill: '#FF073A',
                    r: 1,
                  }}
                />
              </LineChart>
            </div>
            <div className="active-chart">
              <p className="active-title">Total Active</p>
              <LineChart
                width={410}
                height={160}
                data={lineChartData.active}
                margin={{top: 5, right: 60, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={6}
                  tick={{fill: '#007BFF', strokeWidth: 1}}
                />
                <YAxis fontSize={6} tick={{fill: '#007BFF', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#007BFF"
                  strokeWidth={1}
                  dot={{
                    fill: '#007BFF',
                    r: 1,
                  }}
                />
              </LineChart>
            </div>
            <div className="recovered-chart">
              <p className="recovered-title">Recovered</p>
              <LineChart
                width={410}
                height={160}
                data={lineChartData.recovered}
                margin={{top: 5, right: 60, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={6}
                  tick={{fill: '#27A243', strokeWidth: 1}}
                />
                <YAxis fontSize={6} tick={{fill: '#27A243', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#27A243"
                  strokeWidth={1}
                  dot={{
                    fill: '#27A243',
                    r: 1,
                  }}
                />
              </LineChart>
            </div>
            <div className="deceased-chart">
              <p className="deceased-title">Deceased</p>
              <LineChart
                width={410}
                height={160}
                data={lineChartData.recovered}
                margin={{top: 5, right: 60, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={6}
                  tick={{fill: '#6C757D', strokeWidth: 1}}
                />
                <YAxis fontSize={6} tick={{fill: '#6C757D', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#6C757D"
                  strokeWidth={1}
                  dot={{
                    fill: '#6C757D',
                    r: 1,
                  }}
                />
              </LineChart>
            </div>
            <div className="tested-chart">
              <p className="tested-title">Tested</p>
              <LineChart
                width={410}
                height={160}
                data={lineChartData.recovered}
                margin={{top: 5, right: 60, left: 20, bottom: 5}}
              >
                <XAxis
                  dataKey="date"
                  interval="preserveEnd"
                  fontSize={6}
                  tick={{fill: '#9673B9', strokeWidth: 1}}
                />
                <YAxis fontSize={6} tick={{fill: '#9673B9', strokeWidth: 1}} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="number"
                  stroke="#9673B9"
                  strokeWidth={1}
                  dot={{
                    fill: '#9673B9',
                    r: 1,
                  }}
                />
              </LineChart>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        <div className="main-specific-container">
          <Header />
          {this.stateContentStatus()}
          {this.timeLineContentStatus()}
          <Footer />
        </div>
      </>
    )
  }
}

export default StateSpecific
