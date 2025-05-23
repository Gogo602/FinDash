import  { useContext } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import { ThemeContext } from '../context/ThemeContextProvider'
import { IoNotificationsCircleOutline } from "react-icons/io5";
import {FaCog } from 'react-icons/fa';
import { AiOutlineLineChart } from "react-icons/ai";
import { Link } from 'react-router-dom';




const Navbar = () => {
    const {theme, toggleTheme} = useContext(ThemeContext)
  return (
    <div className=' bg-gray-100 flex fixed items-center justify-between text-gray-900 border-b w-full border-gray-300 p-4  dark:border-gray-600 dark:bg-gray-900 dark:text-white space-x-5 px-10'>
      <div className='flex items-center space-x-1 font-bold ml-3'>
        <AiOutlineLineChart className=' w-8 h-8'/>
        <h1>FinDash</h1>
      </div>
      <div className='flex items-center space-x-5'>
          <button className='text-2xl text-dark hover:bg-none' onClick={toggleTheme}>
                {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          <IoNotificationsCircleOutline className='w-6 h-6'/>
          <Link to='#'>
            <FaCog className='w-8 h-8 p-2 bg-black  text-gray-50 dark:bg-white dark:text-gray-900 rounded-full'/>
          </Link>
       </div>
    </div>
  )
}

export default Navbar