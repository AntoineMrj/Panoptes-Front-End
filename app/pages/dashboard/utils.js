import apiClient from 'panoptes-client/lib/api-client';

/**
* Fetch projects from panoptes API
* Can fetch a single project by querying getProjects(project_id)
* @param {object} query Query parameters (see Panoptes API documentation)
* @returns {promise}
*/
export function getProjects(query) {
  return new Promise(function(resolve, reject) {
    resolve(
      apiClient.type('projects').get(query)
      .then((projects) => {
        return projects;
      })
    )
  })
}

export function getClassifications(project_id) {
  return new Promise(function(resolve, reject) {
    resolve(
      apiClient.type('classifications').get({project_id : project_id})
      .then((classifications) => {
        return classifications;
      })
    )
  })
}
