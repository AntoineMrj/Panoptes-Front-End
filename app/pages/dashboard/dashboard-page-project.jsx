
import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'

import DashboardTable from './dashboard-table'
import ProjectInfo from './project-info'
import UserToggleInfo from './user-toggle-info'
import WorkflowPaths from './workflow-paths'

import * as utils from './utils'
import classificationsJson1899 from './data/classifications-projet-1899.json'

const initialTableState = {
    columns: [
        { id: 'user', label: 'User', minWidth: 60 },
    ],
    rows: []
}

export default function DashboardPageProject(props) {

    const [projectName, setProjectName] = useState('Loading...')

    const [workflowPaths, setWorkflowPaths] = useState({})

    const [workflows, setWorkflows] = useState([])
    const [workflowLoaded, setWorkflowLoaded] = useState(false)
    const [currentWorkflow, setCurrentWorkflow] = useState(-1)
    const [tasksType, setTasksType] = useState({})

    const [classifications, setClassifications] = useState([])
    const [classifLoaded, setClassifLoaded] = useState(false)

    const [meanTime, setMeanTime] = useState(-1)

    const [columns, setColumns] = useState(initialTableState.columns)
    const [rows, setRows] = useState(initialTableState.rows)

    const [selectedUser, setSelectedUser] = useState()
    const [classifByUser, setClassifByUser] = useState({})
    const [users, setUsers] = useState([])

    const [buttonStyle, setButtonStyle] = useState()

    // Object containing tasks of the workflow with their type
    var workflowTasks = {}

    // Object containing the classifications after the API call
    var loadedClassifications = {}

    /*
    * Setting the projectName state given the id
    */
    const getProjectName = () => {
        apiClient.type('projects').get(props.params.id)
        .then((project) => {
            setProjectName(project.display_name)
        })
    }

    /*
    * Reinit the columns and rows state
    */
    const clearTableState = () => {
        setColumns(initialTableState.columns)
        setRows(initialTableState.rows)
    }

    /*
    * Loading the workflows of the current project
    */
    const loadWorkflows = () => {
        const query = {
            project_id: props.params.id
        }

        apiClient.type('workflows').get(query)
        .then((workflows) => {
            setWorkflows(workflows)
            setWorkflowLoaded(true)
        })
    }

    /*
    * Loading the classifications of the current project
    */
    const loadClassifications = () => {
        console.log('aller la')
        utils.getClassifications(1, props.params.id, [])
        .then((classifs) => {
            loadedClassifications = classifs
            setClassifLoaded(true)
        })
    }

    /*
    * Loading classifications of current project
    */
    const loadClassificationsJson = () => {
        setClassifications(classificationsJson1899.filter(classif =>
            classif.links.project === props.params.id
        ))
    }

    /*
    * Retrieving all tasks of the current workflow
    */
    const retrieveTasks = () => {
        if (workflowLoaded) {
            clearTableState()
            workflows.forEach(workflow => {
                // We check the current workflow
                if (workflow.id === currentWorkflow) {
                    Object.entries(workflow.tasks).forEach(entry => {
                        let key = entry[0]
                        let value = entry[1]
                        workflowTasks[key] = value.type
                        setColumns(prevColumns =>
                            [...(prevColumns), {
                                id: key,
                                label: key,
                                minWidth: 60,
                                align: 'right',
                                format: value => value.toLocaleString()
                            }]
                        )
                    })
                    setTasksType(workflowTasks)
                }
            })
        }
    }

    /*
    * Calculating the meanTime for the current workflow completion
    */
    const loadProjectInfo = (classifs) => {
        var diffTime = 0
        classifs.forEach(classif => {
            let { started_at, finished_at } = classif.metadata
            diffTime += utils.diffTime(new Date(started_at), new Date(finished_at))
        })
        return (diffTime / classifs.length).toFixed(2)
    }

    /*
    * Creating rows with classifications
    */
    const computeAnnotations = (classifs) => {

        var annotBySubject = {}
        var annotByUser = {}

        // Populating annotBySubject
        classifs.forEach(classif => {
            let subjects = classif.links.subjects.join()
            let user = classif.links.user
            // Populating annotBySubject
            if (subjects in annotBySubject) {
                annotBySubject[subjects].push(classif.annotations)
            } else {
                annotBySubject[subjects] = [classif.annotations]
            }
            // Populating annotByUser
            if (user in annotByUser) {
                annotByUser[user].push({
                    annotations: classif.annotations,
                    subjects: subjects
                })
            } else {
                annotByUser[user] = [{
                    annotations: classif.annotations,
                    subjects: subjects
                }]
                // Populating users state array
                setUsers(prevUsers =>
                    [...(prevUsers),
                        user
                    ]
                )
            }
        })

        let subjectHashProba = {}
        // Populating subjectHashProba with proba of each task per subject
        for (let subject in annotBySubject) {
            subjectHashProba[subject] = {}
            for (let task in workflowTasks) {
                subjectHashProba[subject][task] = { diffAnsTotal: 0 }
            }
            annotBySubject[subject].forEach(annot => {
                annot.forEach(task => {
                    let value = utils.checkForNull(task.value).toString()
                    let taskTitle = task.task
                    if (value in subjectHashProba[subject][taskTitle]) {
                        subjectHashProba[subject][taskTitle][value] += 1
                    } else {
                        subjectHashProba[subject][taskTitle][value] = 1
                    }
                    subjectHashProba[subject][taskTitle].diffAnsTotal += 1
                })
            })
        }
        computeWorkflowPaths(annotBySubject)
        computeScores(annotByUser, subjectHashProba)
    }

    /*
    * Computes all the different workflow paths per subject
    */
    const computeWorkflowPaths = (annotBySubject) => {
        var paths = {}
        Object.entries(annotBySubject).forEach(entry => {
            let subject_id = entry[0]
            let annotations = entry[1]
            paths[subject_id] = { totalAnnotations: annotations.length }
            annotations.forEach(annot => {
                let concatAnnot = concatAnnotation(annot)
                if (concatAnnot in paths[subject_id]) {
                    paths[subject_id][concatAnnot] += 1
                } else {
                    paths[subject_id][concatAnnot] = 1
                }
            })
        })
        setWorkflowPaths(paths)
    }

    /*
    * Concatening similar annotations
    */
    const concatAnnotation = annot =>
        annot.map(task => task.task)
        .reduce((acc, current) => acc + " -> " + current)

    /*
    * Method computing the scores of each user
    */
    const computeScores = (annotByUser, subjectHashProba) => {

        // Object containing the scores of each user on the current workflow
        var scoreByUser = {}

        Object.entries(annotByUser).forEach(entry => {
            let user_id = entry[0]
            let value = entry[1]

            // Initialising score of each task of each user to 0
            scoreByUser[user_id] = {}
            for (let task in workflowTasks) {
                scoreByUser[user_id][task] = 0
            }

            value.forEach(classif => {
                // Going over annotation and subjects
                classif.annotations.forEach(annot => {
                    let { task, value } = annot
                    value = utils.checkForNull(value)
                    let currentValue = subjectHashProba[classif.subjects][task][value.toString()]
                    let diffAnsTotal = subjectHashProba[classif.subjects][task].diffAnsTotal
                    scoreByUser[user_id][task] += currentValue / diffAnsTotal
                })
            })
        })
        createRows(scoreByUser, annotByUser)
    }

    /*
    * Method creating the rows of the score table
    */
    const createRows = (scoreByUser, annotByUser) => {
        // Iterating over the users
        Object.entries(scoreByUser).forEach(entry => {
            let user_id = entry[0]
            let scores = entry[1]

            let row = { user: user_id }

            // Iterating over the tasks to get the scores
            Object.entries(scores).forEach(task => {
                let key = task[0]
                let classifNum = Object.keys(annotByUser[user_id]).length
                let value = (task[1] / classifNum) * 100
                if (value == 0) {
                    row[key] = "n/a"
                } else {
                    row[key] = (value.toFixed(2) + ' %')
                }
            })
            setRows(prevRows =>
                [...(prevRows),
                    row
                ]
            )
        })
    }

    /*
    * Callback that gets the selected user in the DashboardTable component
    */
    const getSelectedUser = (user) => {
        setSelectedUser(user)
    }

    useEffect(() => {
        getProjectName()
        loadWorkflows()
        loadClassifications()
        //loadClassificationsJson()
    }, [])

    useEffect(() => {
        if (classifLoaded) {
            setClassifications(loadedClassifications)
            console.log('loadedClassifications:', loadedClassifications)
        }
    }, [classifLoaded])

    useEffect(() => {
        // Loading tasks of the first workflow
        if (workflowLoaded) {
            setCurrentWorkflow(workflows[0].id)
            retrieveTasks()
        }
    }, [workflowLoaded])

    useEffect(() => {
        // Resetting variables after current workflow selection change
        setUsers([])
        setSelectedUser()
        setClassifByUser({})
        workflowTasks = {}
        // Repopulating variables with current workflow selection
        retrieveTasks()
        const classifByWorkflow = utils.getClassifByWorkflow(classifications, currentWorkflow)
        computeAnnotations(classifByWorkflow)
        setMeanTime(loadProjectInfo(classifByWorkflow))
    }, [currentWorkflow])

    useEffect(() => {
        const classifByWorkflow = utils.getClassifByWorkflow(classifications, currentWorkflow)
        setClassifByUser(utils.getClassifByUser(classifByWorkflow, selectedUser))
    }, [selectedUser])

    /*
    * Handling click on workflow buttons
    */
    const handleWorkflowClick = event => {
        setCurrentWorkflow(event.target.name)
    }

    const workflow_list = workflowLoaded ?
        workflows.map(workflow =>
            <button
                className={currentWorkflow === workflow.id ? 'about-tabs active' : 'about-tabs'}
                onClick={handleWorkflowClick}
                name={workflow.id}
                key={workflow.id}
            >
            {workflow.display_name}
            </button>) :
        "Loading workflows..."

    const paths_list = Object.keys(workflowPaths).length !== 0 ?
        (<WorkflowPaths paths={workflowPaths} />) :
        "Loading paths..."

    const userInfo = Object.keys(classifByUser).length !== 0 ?
        (<UserToggleInfo classifByUser={classifByUser} users={users} workflowTasks={tasksType} />) :
        ""

    return (
        <div>
            <h2>{projectName}</h2>
            <br/>
            {workflow_list}
            <br/>
            <ProjectInfo
                meanTime={meanTime}
            />
            <br/>
            {paths_list}
            <br/>
            {classifLoaded ? '' : "Loading classifications..."}
            <br/>
            <DashboardTable
                rows={rows}
                columns={columns}
                userCallback={getSelectedUser}
            />
            {userInfo}
        </div>
    );
}
