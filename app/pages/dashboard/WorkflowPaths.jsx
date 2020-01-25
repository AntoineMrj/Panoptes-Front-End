import React, {useState, useEffect} from 'react'

const tableStyle = {
    border: "2px solid #ddd"
}

export default function WorkflowPaths(props) {

    const [paths, setPaths] = useState([])

    const displayPaths = () => {
        var toDisplay = []
        Object.entries(props.paths).forEach(subject => {
            let subject_id = subject[0]
            let diffPaths = subject[1]
            Object.entries(diffPaths).forEach(path => {
                toDisplay.push(
                    <tr>
                        <td>{subject_id}</td>
                        <td>{path[0]}</td>
                        <td>{path[1]}</td>
                    </tr>
                )
            })
        })
        setPaths(toDisplay)
    }

    useEffect(() => {
        displayPaths()
    }, [])

    return (
        <div>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th colspan="2">Workflow Paths per subject</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Subject</td>
                        <td>Path</td>
                        <td>Times chosen</td>
                    </tr>
                    {paths}
                </tbody>
            </table>
        </div>
    )

}
