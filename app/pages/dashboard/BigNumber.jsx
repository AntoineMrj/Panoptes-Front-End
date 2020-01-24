import React from 'react'

const spanNumberStyle = {
  fontSize: '25px',
  fontWeight: 'bold',
}

const bigNumberStyle = {
  fontSize: '16px',
  padding: '10px 0 10px 0'
}

function BigNumber(props) {
  return(
    <div style={bigNumberStyle}>
      <span style={spanNumberStyle}>{props.number}</span> {props.text}
    </div>
  )
}

export default BigNumber
