# Dashboard

## Introduction

The goal of this dashboard is to display information, metrics about the current user's projects he created in order to get an idea of the quality of the work done by the volunteers as well as the complexity of the workflows and tasks it is composed of.

## Getting started

Refer to the README at the root of the repository to start the Frontend.

As of now, the dashboard is only accessible via the */dashboard* route. So, after running the Panoptes-Front-End project, it is accessible here: http://localhost:3735/dashboard.

The front-end is connected to the staging back-end of Panoptes. So, an account needs to be created there and the front-end must be run with Docker and Docker Compose in order or the current user to have access to the classification of his projects. And so, for the dashboard to display information.

## Development

### Structure

All the different components we developed and use are located at the root of the dashboard directory. The "root" component of the dashboard is the one called **DashboardPage** in `dashboard-page.jsx`. His goal is to display all the content present on each page of the website as well as the **DashboardPageGeneral** component in `dashboard-page-general.jsx` which displays a list of projects whose click leads to the main component **DashboardPageProject** in `dashboard-page-project.jsx` where all the computations are made regarding users' scores.

We managed the route */dashboard* by adding it to `app/router.jsx`.

A script with useful functions about calls to the
[API](https://panoptes.docs.apiary.io/ "Panoptes API") and filters on classifications especially is available in the directory as well in `utils.js`.

### Limitations
We were unable to fetch gold standards classifications. We tried to call the dedicated endpoint explained in Panoptes [documentation](https://panoptes.docs.apiary.io/#reference/classification/classification-collection/list-all-classifications) but without results.

For some reason, on refresh on project page, the API throw an error (so data is loaded when coming from project list page). 
