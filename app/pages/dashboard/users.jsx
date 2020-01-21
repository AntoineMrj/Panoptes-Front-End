import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

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
            this.setState({ classificationCount: classifications.length.toString() })
            this.setState({ classifications: classifications })
            this.setState({ loaded: true })
          })
      })
  }

  render() {
    //récupère les classifications du projet 1899 (le notre)
    this.state.loaded ? console.log(this.state.classifications.filter(classif => classif.links.project == 1899)) : ''
    const content = this.state.loaded ?
      <div>
        <h1> Bienvenue {this.state.userName} ! </h1>
        <p>Tu as fait {this.state.classificationCount} classifications.</p>
      </div>
    : ''
    return (
      <div>
        {content}
      </div>
    );
  }
}

export default DashboardPageUsers;
