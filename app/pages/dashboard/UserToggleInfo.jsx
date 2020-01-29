import React, {useState, useEffect} from 'react';
import apiClient from 'panoptes-client/lib/api-client';
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
  const [usersLoaded, setUsersLoaded] = useState(false)

  /*
  * Hashing annotations - NOT USED
  */
  const hashAnnotations = (annotations) => {
      var result = ""
      annotations.forEach(annot => {
          console.log(annot)
          if (workflowTasks[annot.task] === 'drawing') {
              // TODO: Compare drawings
              console.log(workflowTasks[annot.task])
          } else {
              result += annot.value
          }
      })
      return result
  }

  useEffect(() => {
    usersLoaded ? setCurrentUser(users.filter(user => user.id == props.classifByUser[0].links.user)[0].display_name) : ''
  }, [props, usersLoaded])

  /*
  * On component mount, fetch usernames given an id set and save them into users state
  */
  useEffect(() => {
    var result = props.users.map((userid) => {
      return apiClient.type('users').get({
        id: userid
      })
      .then((user) => {
        return {"id":parseInt(userid), "display_name":user[0].display_name}
      })
    })

    Promise.all(result).then(function(result) {
      setUsers(result)
      setUsersLoaded(true)
    });
  }, [])

  /*
  * Builds classification details display
  */
  const classifDetails = usersLoaded ? props.classifByUser.map(classif =>
    <div>
      <h4>Classif n°{classif.id} ({utils.diffTime(new Date(classif.metadata.started_at), new Date(classif.metadata.finished_at))} secondes)</h4>
      <ul>
        {
          classif.annotations.map(res =>
            <li style={{listStyleType: 'none'}}>

              {res.task} : {utils.checkForNull(res.value).toString()}
            </li>
          )
        }
      </ul>
    </div>
  )
  : ''

  console.log(props)

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
