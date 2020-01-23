import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link, IndexLink } from 'react-router';
import ProjectList from './ProjectList'
import * as utils from './utils'

class DashboardPageGeneral extends React.Component {
  state={
    loaded: false,
    projects: []
  }

  componentDidMount() {
    this.loadProjects()
    this.getAllUsers()
    //this.getClassifications(604)
  }

  loadProjects() {
    const query = {
      tags: undefined,
      sort: "-launch_date",
      cards: true,
      include: ['avatar'],
      state: 'live',
      page_size: 10000,
    }

    utils.getProjects(query)
    .then((projects) => {
      if (projects.length > 0) {
        this.setState({ projects, loaded:true })
      } else {
        this.setState({ projects: []});
      }
    })
  }

  getAllUsers() {

    const query = {
      page: 66000
    }
    //132378
    //{ id: '1326029' }
    //{ id: '1325316'} => {login: 'markb-panoptes' }

    apiClient.type('users').get({id:'1326036'})
    .then((users) => {
      console.log(users);
    });
  }


  render() {
    const projects = this.state.loaded ? <ProjectList projects={this.state.projects} /> : "loading ..."
    return (
      <div>
      <h1>Liste des projets</h1>
      <p> Sélectionner un projet pour accéder à ses statistiques : </p>
      <ul>
      {projects}
      </ul>
      </div>
    );
  }
}

/*
Créer une liste de projets avec leur nombre de classification à côté
*/

export default DashboardPageGeneral
