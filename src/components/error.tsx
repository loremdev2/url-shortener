import React from 'react'

const Error: React.FC<{ message: string }> = ({ message }) => {
  return (
    <span title="error" className="text-red-500 text-sm font-medium flex items-center space-x-1">
      {message}
    </span>
  )
}

export default Error
