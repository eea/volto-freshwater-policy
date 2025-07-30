import React, {useEffect} from 'react'

function MatrixConnector(props) { 
  useEffect(() => {
    console.log('MATRIX CONNECTOR LOADED', props)
  }, [])
  return <div>
    <p>Matrix connector addon</p>
  </div> 
}

export default MatrixConnector
