import React from 'react'

export const Error = ({ setLoading, message }) => {
  setLoading(false)
  return <p style={{ color: 'red', width: '100%' }}>{message}</p>
}
