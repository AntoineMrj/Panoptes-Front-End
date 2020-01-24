import React, {useState, useEffect} from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import * as utils from './utils'

import infoLogo from './img/info.png'

const toggleInfoStyle = {
    padding: '10px',
    marginTop: '10px',
    borderRadius: '4px',
    backgroundColor: "WhiteSmoke",
    borderColor: "SlateGrey",
}

function UserToggleInfo(props) {
  const [loaded, setLoaded] = useState(false)
  const [currentUser, setCurrentUser] = useState('')

  const [users, setUsers] = useState([])
  const [usersLoaded, setUsersLoaded] = useState(false)

  useEffect(() => {
    usersLoaded ? setCurrentUser(users.filter(user => user.id == props.classifByUser[0].links.user)[0].display_name) : ''
  }, [props])

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

  return(

    <div style={toggleInfoStyle}>

        <h3><img src={infoLogo} /> {currentUser} informations :</h3>
        <ul>
            <li>Average resolution time of the workflow: {utils.computeTimeAverage(props.classifByUser).toFixed(2)} seconds</li>
            <li>{props.classifByUser.length.toString()} classifications done for this workflow</li>
        </ul>
    </div>
  )
}

export default UserToggleInfo
