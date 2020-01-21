import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link, IndexLink } from 'react-router';
import ProjectList from './ProjectList'

class DashboardPageGeneral extends React.Component {
    state={
        loaded: false,
        projects: []
    }

    componentDidMount() {
      this.loadProjects()
      //this.getMyProject()
      //this.getAllUsers()
      //this.getClassifications(604)
    }

    loadProjects() {
        const query = {
            tags: undefined,
            sort: "-launch_date",
            launch_approved: true,
            cards: true,
            include: ['avatar'],
            state: 'live',
            page_size: 10000,
        }

        apiClient.type('projects').get(query)
            .then((projects) => {
                if (projects.length > 0) {
                  this.setState({ projects })
                  this.setState({ loaded: true })
                } else {
                  this.setState({ projects: []});
                }
            })
    }

/*    getMyProject() {
      apiClient.type('subjects').get('1899')
        .then(function (subject) {
            console.log('project 1:' + subject);
        });

      apiClient.type('projects').get( {id: '433' })
          .then((projects) => {
            console.log('project : ' + projects)
          })
    }
*/
    getClassifications(project_id) {
      apiClient.type('classifications').get(1)
          .then((classif) => {
            console.log(classif)
          })
    }

    getAllUsers() {

      const query = {
        page: 132378, //=> 157245
        page_size: 10, // 1326029
        sort: '-login'
      }
      //132378
      //{ id: '1326029' }
      //{ id: '1325316'} => {login: 'markb-panoptes' }

      apiClient.type('users').get({ id: '1326029' })
        .then(function (users) {
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
