import React from 'react'

const Error = ({error}) => {
  return (
    <div>
      <p>{error.message}</p>
    </div>
  )
}

export default Error;