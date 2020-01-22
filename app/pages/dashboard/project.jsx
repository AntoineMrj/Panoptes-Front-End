import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'

import DashboardTable from 'DashboardTable'
import ProjectInfo from 'ProjectInfo'

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
    const [currentWorkflow, setCurrentWorkflow] = useState(0)

    const [classifications, setClassifications] = useState([])
    const [classifLoaded, setClassifLoaded] = useState(false)

    const [columns, setColumns] = useState(initialTableState.columns)
    const [rows, setRows] = useState(initialTableState.rows)

    const [buttonStyle, setButtonStyle] = useState()

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

        console.log(props.location.state)

        apiClient.type('classifications').get(query)
        .then((workflows) => {
            setWorkflows(workflows)
            setWorkflowLoaded(true)
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
    const getClassifications = () => {
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

                    let tasks = []

                    for (let task in workflow.tasks) {
                        tasks.push(task)
                        setColumns(prevColumns =>
                            [...(prevColumns), {
                                id: task,
                                label: task,
                                minWidth: 60,
                                align: 'right',
                                format: value => value.toLocaleString()
                            }]
                        )
                    }
                    // Simulating rows for now
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
                }
            })
        }
    }
    //props.location.state.project

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
            <h3>Project {props.params.id}</h3>
            <br/>
            {workflow_list}
            <br/>
            <ProjectInfo
                projectInfo={projectInfo}
            />
            <br/>
            <DashboardTable
                rows = {rows}
                columns = {columns}
            />
        </div>
    );
}
