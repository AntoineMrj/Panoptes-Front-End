import React, {Component} from 'react'

class DashboardUsersPage extends Component {
    constructor() {
        super()
        this.state={}
    }

    render() {
        return (
            <div>
                <ul>
                    <li><a href="/dashboard">Général</a></li>
                </ul>
                Page utilisateurs
            </div>
        )
    }
}

export default DashboardUsersPage
