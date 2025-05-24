import { Link, NavLink, useLocation } from 'react-router-dom';
import { FaBars, FaCog, FaTimes } from 'react-icons/fa'; 
import { MdOutlineDashboard, MdOutlinePendingActions } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { AiOutlineLineChart } from "react-icons/ai";
import { useEffect, useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false); 

    // Effect to detect dark mode (if not handled globally)
    useEffect(() => {
        const detectDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        detectDarkMode(); // Initial detection
        const observer = new MutationObserver(detectDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);

    // Prevent body scrolling when the mobile navbar is opened
    useEffect(() => {
        if (showMobileMenu) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto"; 
        };
    }, [showMobileMenu]);

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Define active and inactive classes based on theme
    const activeClass = "bg-blue-600 text-white"; 
    const inactiveClass = `hover:bg-gray-200 dark:hover:bg-gray-700 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`; 

    return (
        <>
            {/* Mobile Menu Toggle Button (visible only on small screens) */}
            <div className="md:hidden fixed top-4 left-3 z-40"> 
                <FaBars
                    onClick={() => setShowMobileMenu(true)}
                    className="w-8 h-8 cursor-pointer text-gray-800 dark:text-white border rounded-md" 
                />
            </div>

           
            
            <div className="hidden md:inline-block bg-gray-100 dark:bg-gray-900 dark:text-white
                            min-h-screen fixed mt-16 px-4 w-40 border-r border-t border-gray-300 dark:border-gray-600">
                <ul className='flex flex-col mt-5 text-sm font-bold space-y-6'>
                   
                    <Link
                        to='/'
                        className={`flex items-center py-3 px-2 space-x-4 rounded-lg ${isActive('/') ? activeClass : inactiveClass}`}
                    >
                        <MdOutlineDashboard className="w-5 h-5" />
                        <span className='hidden md:inline'>Dashboard</span>
                    </Link>

                    <Link
                        to='/market'
                        className={`flex items-center py-3 px-2 space-x-4 rounded-lg ${isActive('/market') ? activeClass : inactiveClass}`}
                    >
                        <AiOutlineLineChart className="w-5 h-5" />
                        <span className='hidden md:inline'>Market</span>
                    </Link>

                    <Link
                        to='/convert'
                        className={`flex items-center py-3 px-2 space-x-4 rounded-lg ${isActive('/convert') ? activeClass : inactiveClass}`}
                    >
                        <FaRegStar className="w-5 h-5" />
                        <span className='hidden md:inline'>Convert</span>
                    </Link>

                    <Link
                        to='#'
                        className={`flex items-center py-3 px-2 space-x-4 rounded-lg ${isActive('/portfolio') ? activeClass : inactiveClass}`}
                    >
                        <MdOutlinePendingActions className="w-5 h-5" />
                        <span className='hidden md:inline'>Portfolio</span>
                    </Link>

                    <Link
                        to='#'
                        className={`flex items-center py-3 px-2 space-x-4 rounded-lg ${isActive('/settings') ? activeClass : inactiveClass}`}
                    >
                        <FaCog className="w-5 h-5" />
                        <span className='hidden md:inline'>Settings</span>
                    </Link>
                </ul>
            </div>

            {/* Mobile Sidebar (visible only when showMobileMenu is true and on small screens) */}
            <div
                className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out
                            ${showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShowMobileMenu(false)} 
            >
                <div
                    className={`fixed top-0 bottom-0 left-0 w-64 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white
                                shadow-lg transform transition-transform duration-300 ease-in-out z-50
                                ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
                >
                    <div className='flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700'>
                        <div className='flex items-center space-x-1 font-bold ml-3'>
                                <AiOutlineLineChart className=' w-8 h-8'/>
                                <h1>FinDash</h1>
                        </div>
                        <FaTimes
                            onClick={() => setShowMobileMenu(false)}
                            className='w-8 h-8 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-blue-600 border rounded-md'
                        />
                    </div>

                    <ul className='flex flex-col gap-2 mt-5 px-5 text-lg font-medium'>
                        {/* Mobile Navigation Links */}
                        <NavLink
                            onClick={() => setShowMobileMenu(false)}
                            to={"/"}
                            className={`flex items-center py-3 px-4 rounded-lg ${isActive('/') ? activeClass : `text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}`}
                        >
                             <MdOutlineDashboard className="w-5 h-5 mr-3" /> Dashboard
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMobileMenu(false)}
                            to={"/market"}
                            className={`flex items-center py-3 px-4 rounded-lg ${isActive('/market') ? activeClass : `text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}`}
                        >
                            <AiOutlineLineChart className="w-5 h-5 mr-3" /> Market
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMobileMenu(false)}
                            to={"/convert"}
                            className={`flex items-center py-3 px-4 rounded-lg ${isActive('/convert') ? activeClass : `text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}`}
                        >
                             <FaRegStar className="w-5 h-5 mr-3" /> Convert
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMobileMenu(false)}
                            to={"#"}
                            className={`flex items-center py-3 px-4 rounded-lg ${isActive('#') ? activeClass : `text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}`}
                        >
                             <MdOutlinePendingActions className="w-5 h-5 mr-3" /> Portfolio
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMobileMenu(false)}
                            to={"#"}
                            className={`flex items-center py-3 px-4 rounded-lg ${isActive('#') ? activeClass : `text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700`}`}
                        >
                            <FaCog className="w-5 h-5 mr-3" /> Settings
                        </NavLink>
                        
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;