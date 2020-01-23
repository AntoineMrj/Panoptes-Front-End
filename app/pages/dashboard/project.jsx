import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'

import DashboardTable from 'DashboardTable'
import ProjectInfo from 'ProjectInfo'

import * as utils from './utils'
import classificationsJson from './data/classifications_antoinemrj.json'
import classificationsJson1899 from './data/classifications-projet-1899.json'

const projectInfo = {
    meanTime: 10,
    feltDifficulty: 3.2,
    meanGSscore: 6.8
}

const initialTableState = {
    columns: [
        { id: 'user', label: 'User', minWidth: 60 },
    ],
    rows: []
}

const focusButtonStyle = {
    backgroundColor: "WhiteSmoke",
    borderColor: "SlateGrey",
}

export default function DashboardPageProject(props) {

    const [workflows, setWorkflows] = useState([])
    const [workflowLoaded, setWorkflowLoaded] = useState(false)
    const [currentWorkflow, setCurrentWorkflow] = useState(-1)

    const [classifications, setClassifications] = useState([])
    const [classifLoaded, setClassifLoaded] = useState(false)

    const [meanTime, setMeanTime] = useState(-1)
    const [feltDifficulty, setFeltDifficulty] = useState(-1)

    const [columns, setColumns] = useState(initialTableState.columns)
    const [rows, setRows] = useState(initialTableState.rows)

    const [selectedUser, setSelectedUser] = useState()
    const [isUserSelected, setIsUserSelected] = useState(false)
    const [classifByUser, setClassifByUser] = useState({})

    const [buttonStyle, setButtonStyle] = useState()

    // Object containing tasks of the workflow with their type
    var workflowTasks = {}

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
        const query = {
            project_id: props.params.id
        }

        apiClient.type('classifications').get(query)
        .then((classifs) => {
            setClassifications(classifs)
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
    * Returns all classifications of the current workflow
    */
    const getClassifByWorkflow = () => {
        return classifications.filter(classif =>
            classif.links.workflow === currentWorkflow
        )
    }

    const getClassifByUser = (classifs) => {
        return classifs.filter(classif =>
            classif.links.user === selectedUser
        )
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
                        //tasks.push(task)
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
        return diffTime / classifs.length
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
                    var value = task.value.toString()
                    var taskTitle = task.task
                    if (value in subjectHashProba[subject][taskTitle]) {
                        subjectHashProba[subject][taskTitle][value] += 1
                    } else {
                        subjectHashProba[subject][taskTitle][value] = 1
                    }
                    subjectHashProba[subject][taskTitle].diffAnsTotal += 1
                })
            })
        }
        computeScores(annotByUser, subjectHashProba)
    }

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
                row[key] = (value.toFixed(2) + ' %')
            })
            setRows(prevRows =>
                [...(prevRows),
                    row
                ]
            )
        })
    }

    /*
    * Hashing annotations - NOT USED
    */
    const hashAnnotations = (annotations) => {
        var result = ""
        annotations.forEach(annot => {
            if (workflowTasks[annot.task] === 'drawing') {
                // TODO: Compare drawings
            } else {
                result += annot.value
            }
        })
        return result
    }

    /*
    * Callback that gets the selected user in the DashboardTable component
    */
    const getSelectedUser = (user) => {
        setSelectedUser(user)
    }

    useEffect(() => {
        loadWorkflows()
        //loadClassifications()
        loadClassificationsJson()
    }, [])

    useEffect(() => {
        // Loading tasks of the first workflow
        if (workflows.length > 0) {
            setCurrentWorkflow(workflows[0].id)
            retrieveTasks()
        }
    }, [workflowLoaded])

    useEffect(() => {
        retrieveTasks()
        var classifByWorkflow = getClassifByWorkflow()
        computeAnnotations(classifByWorkflow)
        setMeanTime(loadProjectInfo(classifByWorkflow))
    }, [currentWorkflow])

    useEffect(() => {
        setIsUserSelected(true)
        console.log("selectedUser: ", selectedUser)
        console.log("classifByUser 1: ", getClassifByUser(getClassifByWorkflow()))
        var classifByWorkflow = getClassifByWorkflow()
        setClassifByUser(getClassifByUser(classifByWorkflow))
        console.log("classifByUser 2: ", classifByUser)
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
                //style={buttonStyle}
                className="workflow-button"
                onClick={handleWorkflowClick}
                name={workflow.id}
                key={workflow.id}
            >
            {workflow.display_name}
            </button>) :
        "loading..."

    const userInfo = ""

    return (
        <div>
            <h3>{props.location.state.project.display_name}</h3>
            <br/>
            {workflow_list}
            <br/>
            <ProjectInfo
                projectInfo={projectInfo}
                meanTime={meanTime}
                feltDifficulty={feltDifficulty}
            />
            <br/>
            <DashboardTable
                rows={rows}
                columns={columns}
                userCallback={getSelectedUser}
            />
        </div>
    );
}
