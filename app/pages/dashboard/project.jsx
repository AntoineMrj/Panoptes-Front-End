
import React, {useState, useEffect} from 'react'
import DashboardTable from 'DashboardTable'

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

function DashboardPageProject() {
    return (
        <div>
            <p>This is the project page</p>
            <DashboardTable
                rows = {rows}
                columns = {columns}
            />
        </div>
    );
}

export default DashboardPageProject;
