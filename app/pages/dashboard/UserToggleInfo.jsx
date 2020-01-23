import React from 'react';
import * as utils from './utils'

class UserToggleInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      display_name: ''
    }

    this.loadUserInfo = this.loadUserInfo.bind(this)
  }

  componentDidMount() {
    //this.loadUserInfo()
  }

  loadUserInfo() {
    utils.getUsername(this.props.classifByUser[0].links.user)
      .then((user) => {
        this.setState({
          loaded: true,
          display_name: user[0].display_name
        })
      })
  }

  render() {
    //this.state.loaded ? console.log(this.state.display_name) : ''
    return (
      <div>
          <p>User information:</p>
          <ul>
              <li>Average resolution time of the workflow: {utils.computeTimeAverage(this.props.classifByUser).toFixed(2)} seconds</li>
              <li>{this.props.classifByUser.length.toString()} classifByUser done for this workflow</li>
              <li>Mean GoldStandard score: /10</li>
          </ul>
      </div>
    )
  }
}

export default UserToggleInfo
