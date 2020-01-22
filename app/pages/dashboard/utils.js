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


/**
* Fetch classifications for a given project
* @param {integer} project_id Project id
* @returns {promise}
*/
// TODO : gérer les requêtes plus complexes avec le page_size etc
// https://panoptes.docs.apiary.io/#reference/classification/classification-collection/list-all-classifications
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

/**
* Return the time (in seconds) between 2 dates
* @param {date} started_at  Start time
* @param {date} finished_at End time
* @return {integer} Number of seconds between the 2 dates
*/
export function diffTime(started_at, finished_at) {
  return Math.ceil(Math.abs(finished_at - started_at)/1000);
}
