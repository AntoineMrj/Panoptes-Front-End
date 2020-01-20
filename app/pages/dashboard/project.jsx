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

const rows = [
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

const columns = [
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

export default function DashboardPageProject(props) {

    console.log('PARAM : ' + props.params.id)

    const [workflows, setWorkflows] = useState()
    const [isLoaded, setIsLoaded] = useState(false)

    /*
     * Getting highest version of each workflow and return them
     */
    function getWorkflows() {
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

    useEffect(() => {
        setWorkflows(getWorkflows())
        console.log("workflows: ", workflows)
    }, [])

    useEffect(() => {
        console.log("workflows: ", workflows)
    }, [isLoaded])

    const workflow_list = isLoaded ?
        workflows.map(workflow => <li key={workflow.id}>workflow.display_name</li>) :
        "loading ..."

    return (
        <div>
            <ul>
                {workflow_list}
            </ul>
            <p>{isLoaded ? Object.keys(workflows).length : "loading ..."}</p>
            <ProjectInfo
                projectInfo = {projectInfo}
            />
            <DashboardTable
                rows = {rows}
                columns = {columns}
            />
        </div>
    );
}
