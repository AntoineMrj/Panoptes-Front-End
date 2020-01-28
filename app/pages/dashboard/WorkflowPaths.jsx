import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'

const tableStyle = {
    textAlign: "center",
    width: "50%",
    float: "left"
}

const imageStyle = {
    width: "50%",
    position: "relative"
}

export default function WorkflowPaths(props) {

    const [paths, setPaths] = useState([])
    const [image, setImage] = useState("")

    /*
    * Displaying the workflow paths in a table
    */
    const displayPaths = () => {
        var toDisplay = []
        let colorNum = 1
        Object.entries(props.paths).forEach(subject => {
            let subject_id = subject[0]
            let diffPaths = subject[1]
            let subjectTmp = ""
            let totalAnnotations = diffPaths.totalAnnotations
            Object.entries(diffPaths).forEach(pathInfo => {
                let color = (colorNum % 2 == 0) ? "WhiteSmoke" : "white"
                let path = pathInfo[0]
                let value = pathInfo[1]
                if (!(path === "totalAnnotations")) {
                    value = ((value / totalAnnotations) * 100).toFixed(2) + ' %'
                    if (subjectTmp == subject_id) {
                        toDisplay.push(
                            <tr style={{backgroundColor: color}}>
                                <td></td>
                                <td>{path}</td>
                                <td>{value}</td>
                            </tr>
                        )
                    } else {
                        toDisplay.push(
                            <tr style={{backgroundColor: color}}>
                                <td
                                    onMouseOver={() => displayImage(subject_id)}
                                    onMouseOut={() => setImage("")}
                                >{subject_id}</td>
                                <td>{path}</td>
                                <td>{value}</td>
                            </tr>
                        )
                    }
                    subjectTmp = subject_id
                }
            })
            colorNum += 1
        })
        setPaths(toDisplay)
    }

    /*
    * Calling the api to get the image src of the subject
    */
    const displayImage = (subject_id) => {
        apiClient.type('subjects').get(subject_id)
        .then((subject) => {
            setImage(Object.values(subject.locations[0]))
        })
    }

    useEffect(() => {
        displayPaths()
    }, [props])

    return (
        <div>
            <h3>Workflow Paths per subject</h3>
            <br/>
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
            <img src={image} style={imageStyle} />
        </div>
    )

}
