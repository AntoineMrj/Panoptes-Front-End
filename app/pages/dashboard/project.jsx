import React, {useState, useEffect} from 'react'
import DashboardTable from 'DashboardTable'

function DashboardProjectPage() {

    const [test] = useState('props test')

    return (
        <div>
            <ul>
                <li><a href="/dashboard">Général</a></li>
            </ul>
            <p>Projects page</p>

            <DashboardTable
                prop={test}
            />

        </div>
    )
}

export default DashboardProjectPage
