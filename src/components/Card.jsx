import React from 'react'

const Card = ({icon, title, value}) => {
  return (
    <div className='bg-white text-dark p-4 shadow-md space-y-2
    dark:bg-gray-800 dark:text-white'>
        <div className='text-xl text-gray-500'>{icon}</div>
        <p className='text-2xl'>{value}</p>
        <h2 className='text-lg font-semibold'>{title}</h2>
    </div> 
  )
}

export default Card