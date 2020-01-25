import React, {useState, useEffect} from 'react'

const tableStyle = {
    textAlign: "center",
    width: "50%"
}

export default function WorkflowPaths(props) {

    const [paths, setPaths] = useState([])

    const displayPaths = () => {
        var toDisplay = []
        let colorNum = 1
        Object.entries(props.paths).forEach(subject => {
            let subject_id = subject[0]
            let diffPaths = subject[1]
            let subjectTmp = ""
            Object.entries(diffPaths).forEach(path => {
                let color = (colorNum % 2 == 0) ? "WhiteSmoke" : "white"
                if (subjectTmp == subject_id) {
                    toDisplay.push(
                        <tr style={{backgroundColor: color}}>
                            <td></td>
                            <td>{path[0]}</td>
                            <td>{path[1]}</td>
                        </tr>
                    )
                } else {
                    toDisplay.push(
                        <tr style={{backgroundColor: color}}>
                            <td>{subject_id}</td>
                            <td>{path[0]}</td>
                            <td>{path[1]}</td>
                        </tr>
                    )
                }
                subjectTmp = subject_id
            })
            colorNum += 1
        })
        setPaths(toDisplay)
    }

    useEffect(() => {
        displayPaths()
    }, [])

    return (
        <div>
            <h3>Workflow Paths per subject</h3>
            <table style={tableStyle}>
                <thead>
                    <tr style={{backgroundColor: "#e7e7e7"}}>
                        <th>Subject</th>
                        <th>Path</th>
                        <th>Times chosen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    </tr>
                    {paths}
                </tbody>
            </table>
        </div>
    )

}
