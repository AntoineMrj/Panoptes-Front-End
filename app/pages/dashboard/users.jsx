import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import * as utils from './utils'
import UserToggleInfo from './UserToggleInfo'

class DashboardPageUsers extends React.Component {
  state={
    loaded: false,
    userName: '',
    classificationCount: '',
    classifications: []
  }

  componentDidMount() {
    this.loadUserData()
  }

  getClassifications() {
    setTimeout(() => {
      utils.getClassifications(1899)
      .then((classifications) => {
        console.log(classifications)
      })
     }, 500);
  }

  loadUserData() {
    const query = {
        page_size: 100
    }

    apiClient.type('users').get({ id: '1326029' })
      .then((user) => {
            this.setState({ userName: user[0].display_name })
      })
      .then(() => {
        apiClient.type('classifications').get(query)
          .then((classifications) => {
            this.setState({
              classificationCount: classifications.length.toString(),
              classifications: classifications,
              loaded: true
            })
          })
      })
  }

  render() {
    //récupère les classifications du projet 1899 (le notre)
    const data = this.state.loaded ? utils.extractClassifications(this.state.classifications, 1899)
      .map(classif =>
        <div>
          <h3>Classif n° {classif.id} ({utils.diffTime(new Date(classif.metadata.started_at), new Date(classif.metadata.finished_at))} secondes)</h3>
          {classif.annotations.map(res =>
            <p>
              {res.task} : {res.value.toString()}
            </p>)}
        </div>)
        : ''

    const content = this.state.loaded ?
      <div>
        <h1> Bienvenue {this.state.userName} ! </h1>
        {this.state.classifications.length > 0 ?
          <div>
            <p>Tu as fait {this.state.classificationCount} classifications.</p>
            <p>En moyenne tu passes {utils.computeTimeAverage(this.state.classifications).toFixed(2)} secondes par classification.</p>
          </div>
          : <p>Tu n'as pas encore fait de classifications.</p>}
      </div>
    : ''

    const toggle = this.state.loaded ? <UserToggleInfo classifByUser={this.state.classifications} /> : ''

    return (
      <div>
        {toggle}
        {content}
        {data}
      </div>
    );
  }
}

export default DashboardPageUsers;
