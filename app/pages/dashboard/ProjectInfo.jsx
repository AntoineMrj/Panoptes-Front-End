import React, {useState, useEffect} from 'react'
import BigNumber from './BigNumber'

export default function ProjectInfo(props) {
    return (
        <div>
            <BigNumber
                number={props.meanTime + "s"}
                text=" average resolution time of the workflow (all users)"
            />
        </div>
    )
}
