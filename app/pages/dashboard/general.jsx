import React, {useState, useEffect} from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import { Link, IndexLink } from 'react-router';
import ProjectList from './ProjectList'
import * as utils from './utils'

function DashboardPageGeneral() {
  const [loaded, setLoaded] = useState(false)
  const [projects, setProjects] = useState([])

  /*
  * Loading projects
  * TODO : list only user projects
  */
  const loadProjects = () => {
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
        setProjects(projects)
        setLoaded(true)
      } else {
        setProjects([])
      }
    })
  }

  useEffect(() => {
    utils.getClassifications(1899)
    .then(e => console.log(e))
    loadProjects()
  }, [])

  const projectsDisplay = loaded ? <ProjectList projects={projects} /> : "loading ..."
  return(
    <div>
      <h1>Liste des projets</h1>
      <p> Sélectionner un projet pour accéder à ses statistiques : </p>
      <ul>
      {projectsDisplay}
      </ul>
    </div>
  )
}

export default DashboardPageGeneral
