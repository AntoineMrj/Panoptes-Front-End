import React, {useState, useEffect} from 'react'
import apiClient from 'panoptes-client/lib/api-client'
import * as utils from './utils'

import BigNumber from './BigNumber'
import infoLogo from './img/info.png'

const toggleInfoStyle = {
    padding: '30px',
    marginTop: '10px',
    borderRadius: '4px',
    backgroundColor: "WhiteSmoke",
    borderColor: "SlateGrey",
}

function UserToggleInfo(props) {
    const [currentUser, setCurrentUser] = useState('')
    const [users, setUsers] = useState([])
    const [classifData , setClassifData] = useState([])

    /*
    * On props change and when user loaded, set selected username
    */
    useEffect(() => {
        users.length != 0 ? setCurrentUser(users.filter(user => user.id == props.classifByUser[0].links.user)[0].display_name) : ''
    }, [props, users])

    /*
    * On component mount, fetch usernames given an id set and save them into users state
    */
    useEffect(() => {
        const promises = props.users.map(userid => {
            return apiClient.type('users').get({
                id: userid
            })
            .then((user) => {
                return {"id":parseInt(userid), "display_name":user[0].display_name}
            })
        })

        Promise.all(promises).then(res => {
            setUsers(res)
        })
    }, [])

    /*
    * On props change, fetch images src, annotations and classification id and save them in state
    */
    useEffect(() => {
        getClassifData()
    }, [props])

    /*
    * Build a minimal object representing classifications
    */
    const getClassifData = () => {
        let promises = []
        props.classifByUser.map(classif => {
            promises.push(
                apiClient.type('subjects').get(classif.links.subjects[0])
                .then(subject => {
                    return {
                        classif_id: classif.id,
                        subject: subject.locations[0]["image/jpeg"],
                        annotations: classif.annotations
                    }
                })
            )
        })

        Promise.all(promises)
        .then(res => {
            setClassifData(res)
        })
    }

    /*
    * Builds li display of annotations
    */
    const displayAnnotations = (classif) => {
        return classif.map(data => {
            return data.annotations.map(annotation => {
                if (props.workflowTasks[annotation.task] === "drawing") {
                    return <div><img src={data.subject} alt="test" /></div>
                }
                else {
                    return <div>{annotation.task} : {utils.checkForNull(annotation.value).toString()}</div>
                }
            })
        })
    }

    /*
    * Builds classification details display
    */
    const classifDetails = users.length != 0 ? props.classifByUser.map(classif =>
        <div>
        <h4>Classif n°{classif.id} ({utils.diffTime(new Date(classif.metadata.started_at), new Date(classif.metadata.finished_at))} secondes)</h4>
        <ul>
        {
            classif.annotations.map(res =>
                <li style={{listStyleType: 'none'}}>
                {classifData.length !=0 ? displayAnnotations(classifData) : ''}
                </li>
            )
        }
        </ul>
        </div>
    )
    : ''

    return(
        <div style={toggleInfoStyle}>
        <h3 style={{fontSize: '20px'}}><img src={infoLogo} /> {currentUser} informations :</h3><br/>
        <BigNumber number={utils.computeTimeAverage(props.classifByUser).toFixed(2) + "s"} text=" average resolution time of the workflow"/>
        <BigNumber number={props.classifByUser.length.toString()} text=" classifications done for this workflow"/>
        <br/>
        <h4 style={{fontSize: '18px'}}>Classifications details :</h4><br/>
        {classifDetails}
        </div>
    )
}

export default UserToggleInfo
