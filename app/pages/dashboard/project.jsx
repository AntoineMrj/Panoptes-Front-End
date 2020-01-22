import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'

import DashboardTable from 'DashboardTable'
import ProjectInfo from 'ProjectInfo'

import * as utils from './utils'
import classificationsJson from './data/classifications_antoinemrj.json'

const names = [
    'Jean',
    'Paul',
    'Pena',
    'Pierre',
    'Jacques',
    'Thomas',
    'Rémi',
    'Alexandre',
    'Jeanne',
    'Estelle',
    'Solène',
    'Louise',
    'Marie',
    'Robert',
    'Lola',
]

const projectInfo = {
    meanTime: 10,
    feltDifficulty: 3.2,
    meanGSscore: 6.8
}

const initialTableState = {
    columns: [{ id: 'user', label: 'User', minWidth: 100 }],
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
        setClassifications(classificationsJson.filter(classif =>
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
                    // Simulating rows for now
                    /*
                    names.forEach(name => {
                        let randScoresRow = { user: name }
                        tasks.forEach(task => {
                            randScoresRow[task] = Math.round(Math.random() * 10) + '/10'
                        })
                        setRows(prevRows =>
                            [...(prevRows),
                                randScoresRow
                            ]
                        )
                    })
                    */
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
    const createRows = (classifs) => {

        var annotBySubject = {}
        var subjectHashProba = {}

        // Populating annotBySubject
        classifs.forEach(classif => {
            let subjects = classif.links.subjects.join()
            if (subjects in annotBySubject) {
                annotBySubject[subjects].push(classif.annotations)
            } else {
                annotBySubject[subjects] = [classif.annotations]
            }
        })

        // Populating subjectHashProba with proba of each hash per subject
        for (let subject in annotBySubject) {
            subjectHashProba[subject] = {}
            annotBySubject[subject].forEach(annot => {
                const hash = hashAnnotations(annot)
                if (hash in subjectHashProba) {
                    subjectHashProba[subject][hash] += 1
                } else {
                    subjectHashProba[subject][hash] = 1
                }
            })
        }
        console.log("subjectHashProba: ", subjectHashProba)

    }

    /*
    * Hashing annotations
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

    useEffect(() => {
        //setWorkflows(getWorkflows())
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
        createRows(classifByWorkflow)
        setMeanTime(loadProjectInfo(classifByWorkflow))
    }, [currentWorkflow])

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
                rows = {rows}
                columns = {columns}
            />
        </div>
    );
}
