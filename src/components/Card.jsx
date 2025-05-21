import React from 'react'

const Card = ({icon, title, value, change, changeIcon, changeType}) => {
  return (
    <div className='bg-white text-dark p-4 shadow-md space-y-2
    dark:bg-gray-800 dark:text-white'>
        <div className='text-xl text-gray-900 font-bold flex items-center justify-between pb-2'>
          <h1 className='text-sm'>{title}</h1>
          <p>{icon}</p>
        </div>
        <p className='text-2xl font-bold'>{value}</p>
      <div className='flex items-center'>
        <p>{changeIcon}</p>
        <p>{changeType}</p>
        <h2 className='text-sm font-semibold'>{change}</h2>
      </div>
    </div> 
  )
}

export default Card