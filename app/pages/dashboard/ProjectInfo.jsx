import React, {useState, useEffect} from 'react'

function ProjectInfo(props) {
    return (
        <div>
            <p>Project information:</p>
            <ul>
                <li>Average resolution time of the workflow: {props.meanTime} seconds</li>
                <li>Felt difficulty of the workflow: {props.feltDifficulty}/5</li>
                <li>Mean GoldStandard score: {props.projectInfo.meanGSscore}/10</li>
            </ul>
        </div>
    );
}

export default ProjectInfo;
