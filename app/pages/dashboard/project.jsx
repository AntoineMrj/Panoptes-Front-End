import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'

import DashboardTable from 'DashboardTable'
import ProjectInfo from 'ProjectInfo'

import workflowsJson from './data/workflows.json'
import classificationsJson from './data/classifications.json'

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

function getClassifications() {
    classificationsJson.map((classification) => {
        return {
            user: classification.user_name,
            workflow: classification.workflow_id
        }
    })
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

    const [workflows, setWorkflows] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    const [currentWorkflow, setCurrentWorkflow] = useState()

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
    * Getting highest version of each workflow and return them
    */
    const getWorkflows = () => {
        console.log("getWorkflow")
        var version = {}
        var workflows = {}
        workflowsJson.map(workflow =>  {
            var id = workflow.workflow_id
            if (!(id in version)) {
                version[id] = workflow.version
            }
            if (version[id] <= workflow.version) {
                workflows[id] = workflow
            }
            //console.log(Object.keys(workflow.tasks).length)
        })
        setIsLoaded(true)
        return Object.values(workflows)
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
            setIsLoaded(true)
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
        .then((workflows) => {
            setWorkflows(workflows)
            setIsLoaded(true)
        })
    }

    /*
    * Retrieving all tasks of the current workflow
    */
    const retrieveTasks = () => {
        if (isLoaded) {
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

    useEffect(() => {
        //setWorkflows(getWorkflows())
        loadWorkflows()
        loadClassifications()
    }, [])

    useEffect(() => {
        // Loading tasks of the first workflow
        if(typeof workflows !== undefined){
          if (workflows !== undefined) {
              setCurrentWorkflow(workflows[0].id)
              retrieveTasks()
          }
        }

    }, [isLoaded])

    useEffect(() => {
        retrieveTasks()
    }, [currentWorkflow])

    const handleWorkflowClick = event => {
        setCurrentWorkflow(event.target.name)
    }

    const workflow_list = isLoaded ?
        workflows.map(workflow =>
            <button
                //style={buttonStyle}
                className="workflow-button"
                onClick={handleWorkflowClick}
                name={workflow.id}
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
            <br/>

            <DashboardTable
                rows = {rows}
                columns = {columns}
            />
        </div>
    );
}
