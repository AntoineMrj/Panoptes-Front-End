import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import * as utils from './utils'

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
    const data = this.state.loaded ? this.state.classifications
      .filter(classifications => classifications.links.project == 1899)
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
        <p>Tu as fait {this.state.classificationCount} classifications.</p>
      </div>
    : ''
    return (
      <div>
        {content}
        {data}
      </div>
    );
  }
}

export default DashboardPageUsers;
