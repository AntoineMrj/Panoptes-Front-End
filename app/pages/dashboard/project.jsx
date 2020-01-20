import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'

import DashboardTable from 'DashboardTable'
import ProjectInfo from 'ProjectInfo'

import workflowsJson from './data/workflows.json'
import classificationsJson from './data/classifications.json'

function createData(user, sub_task1, sub_task2, sub_task3) {
    const task_score = (sub_task1 + sub_task2 + sub_task3) / 3;
    return { user, sub_task1, sub_task2, sub_task3, task_score };
}

const rows_example = [
    createData('Jean', 7, 8.5, 5.6),
    createData('Paul', 7, 8.5, 5.6),
    createData('Pena', 7, 8.5, 5.6),
    createData('Pierre', 7, 8.5, 5.6),
    createData('Jacques', 7, 8.5, 5.6),
    createData('Thomas', 7, 8.5, 5.6),
    createData('Rémi', 7, 8.5, 5.6),
    createData('Alexandre', 7, 8.5, 5.6),
    createData('Jeanne', 7, 8.5, 5.6),
    createData('Estelle', 7, 8.5, 5.6),
    createData('Solène', 7, 8.5, 5.6),
    createData('Louise', 7, 8.5, 5.6),
    createData('Marie', 7, 8.5, 5.6),
    createData('Robert', 7, 8.5, 5.6),
    createData('Lola', 7, 8.5, 5.6),
];

const columns_example = [
    { id: 'user', label: 'User', minWidth: 100 },
    {
        id: 'sub_task1',
        label: 'Score sub-task 1',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'sub_task2',
        label: 'Score sub-task 2',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'sub_task3',
        label: 'Score sub-task 3',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    },
    {
        id: 'task_score',
        label: 'Task average score',
        minWidth: 60,
        align: 'right',
        format: value => value.toLocaleString(),
    }
];

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

export default function DashboardPageProject(props) {

    const [workflows, setWorkflows] = useState()
    const [isLoaded, setIsLoaded] = useState(false)
    const [currentWorkflow, setCurrentWorkflow] = useState()

    const [columns, setColumns] = useState(initialTableState.columns)
    const [rows, setRows] = useState(initialTableState.rows)

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

    useEffect(() => {
        //setWorkflows(getWorkflows())
        loadWorkflows()
    }, [])

    useEffect(() => {
        if (isLoaded) {
            clearTableState()
            workflows.forEach(workflow => {
                // We check the current workflow
                if (workflow.id === currentWorkflow) {
                    for (let task in workflow.tasks) {
                        setColumns(prevColumns =>
                            [...(prevColumns), {
                                id: task,
                                label: task,
                                minWidth: 60,
                                align: 'right',
                                format: value => value.toLocaleString()
                            }]
                        )
                        //setRows(task)
                    }
                }
            })
        }
    }, [currentWorkflow])

    const handleWorkflowClick = event => {
        setCurrentWorkflow(event.target.name)
    }

    const workflow_list = isLoaded ?
        workflows.map(workflow => <button onClick={handleWorkflowClick} name={workflow.id}>{workflow.display_name}</button>) :
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
