import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class DashboardPageGeneral extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            loaded: false,
            projects: []
        }

        this.loadProjects = this.loadProjects.bind(this)
    }

    componentDidMount() {
      this.loadProjects()
    }

    loadProjects() {
        const query = {
            tags: undefined,
            sort: "-launch_date",
            launch_approved: true,
            cards: true,
            include: ['avatar'],
            state: 'live',
            page_size: undefined,
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


  render() {
      // console.log(this.state.projects[0])
      //si les données ont été chargée on créé un <li> par projet avec comme clef son id et comme contenu son nom
      const projects = this.state.loaded ?
          this.state.projects.map(project => <li key={project.id}>{project.display_name}</li>) :
          "loading ..."
    return (
      <div>
        Ceci est la page général

        <h1>Liste des projets</h1>
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
