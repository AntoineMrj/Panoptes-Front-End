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
// TODO : gérer la pagination pour les projets avec bcp de classifs
// https://panoptes.docs.apiary.io/#reference/classification/classification-collection/list-all-classifications
export function getClassifications(project_id) {
  return new Promise(function(resolve, reject) {
    resolve(
      apiClient.type('classifications/project').get({
        project_id: project_id,
        page_size: 1000
      })
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

/**
* Extract classifications related to a specific project from classifications
* @param {object} classifications Object containing classifications
* @param {integer} project_id     Id of the project to filter on
* @return {object} Return the filtered classifications
*/
export function extractClassifications(classifications, project_id) {
  return classifications.filter(classifications => classifications.links.project == project_id)
}

export function extractDistinctProjects(classifications) {
  //var res = classifications.map((classif) => classif.)

  //console.log(res)

  return null
}

/**
* Provide username (display_name) given a user id
* @param {integer} user_id User id
* @returns {promise}
*/
export function getUsername(user_id) {
  return new Promise(function(resolve, reject) {
    resolve(
      apiClient.type('users').get({
        id: user_id
      })
      .then((user) => {
        return user;
      })
    )
  })
}

/**
* Computes average time spent on classifications given a classification set
* @param {object} classifications Object containing classifications
* @return {number} Return the avegare time spent
*/
export function computeTimeAverage(classifications) {
  return classifications
  .map((classification) => diffTime(new Date(classification.metadata.started_at), new Date(classification.metadata.finished_at)))
  .reduce((acc, curr) => acc + curr) / classifications.length
}
