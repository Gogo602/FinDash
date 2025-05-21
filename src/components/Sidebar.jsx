import { Link, useLocation } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { AiOutlineLineChart } from "react-icons/ai";


const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const activeClass = "bg-orange-500 text-orange-50 text-white";
    const inactiveClass = "hover:bg-gray-600 hover:text-white";

    return (
        <div className=" hidden bg-gray-100 text-gray-900 h-auto mt-16 px-4 w-40 border-r border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white md:inline-block">
            <ul className='flex flex-col mt-5 text-sm font-bold space-y-6'>
                <Link 
                    to='#' 
                    className={`flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer ${isActive('#') ? activeClass : inactiveClass}`}
                >
                    <MdOutlineDashboard />
                    <span className='hidden md:inline'>{('Dashboard')}</span>
                </Link>
                
                <Link 
                    to='#' 
                    className={`flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer ${isActive('#') ? activeClass : inactiveClass}`}
                >
                    <AiOutlineLineChart />
                    <span className='hidden md:inline'>{('Market')}</span>
                </Link>
                
                <Link 
                    to='#' 
                    className={`flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer ${isActive('#') ? activeClass : inactiveClass}`}
                >
                    <FaRegStar />
                    <span className='hidden md:inline'>{('Watchlist')}</span>
                </Link>
                
                
                <Link 
                    to='#' 
                    className={`flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer ${isActive('#') ? activeClass : inactiveClass}`}
                >
                    <MdOutlinePendingActions />
                    <span className='hidden md:inline'>{('Portfolio')}</span>
                </Link>
                
                <Link 
                    to='#' 
                    className={`flex items-center py-3 px-2 space-x-4 hover:rounded hover:cursor-pointer ${isActive('#') ? activeClass : inactiveClass}`}
                >
                    <FaCog />
                    <span className='hidden md:inline'>{('settings')}</span>
                </Link>
            </ul>
        </div>
    );
};

export default Sidebar;