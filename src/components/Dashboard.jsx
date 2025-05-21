import React, { useState } from 'react'; 


import Stock from './stock/Stock';
import Crypto from './crypto/Crypto';

// Assuming you have Crypto components (create these if you don't)
// import CryptoPerformanceChart from './crypto/CryptoChart';
// import CryptoWatchList from './crypto/CryptoWatchList';
// import CryptoMarketOverview from './crypto/CryptoMarketOverview';


const Dashboard = () => {
    // State to manage the active tab: 'stock' or 'crypto'
    const [activeTab, setActiveTab] = useState('stock'); // Default to 'stock' view

    // Helper function for button styling
    const getButtonClasses = (tabName) => {
        return `p-1 rounded-md transition-colors duration-200 ease-in-out ${
            activeTab === tabName
                ? 'bg-blue-600 text-white dark:bg-blue-500' // Active state
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600' // Inactive state
        }`;
    };

    return (
        <div className='w-full h-auto mt-16 mb-10'>
            <div className='mt-8'>
                <div className='flex items-center justify-between py-8'>
                    {/* These comments should be removed in final code */}
                    {/* these two buttons are supposed to switch btween each components of crypto or stock when a user clicked on it and should indicate i it is active or not */}
                    <h1>Dashboard</h1>
                    <button className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200'>Add Assets</button>
                </div>
                <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center p-2 space-x-3 bg-white dark:bg-gray-800 rounded-md shadow-sm'> {/* Added shadow-sm */}
                        <button
                            onClick={() => setActiveTab('stock')}
                            className={getButtonClasses('stock')}
                        >
                            Stock
                        </button>
                        <button
                            onClick={() => setActiveTab('crypto')}
                            className={getButtonClasses('crypto')}
                        >
                            Crypto
                        </button>
                    </div>
                    {/* Time frame filters - you'd also need state to manage these */}
                    <ul className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
                        <li className='cursor-pointer px-2 py-1 hover:text-blue-500'>1D</li>
                        <li className='cursor-pointer px-2 py-1 hover:text-blue-500'>1W</li>
                        <li className='cursor-pointer px-2 py-1 hover:text-blue-500'>1M</li>
                        <li className='cursor-pointer px-2 py-1 hover:text-blue-500'>1Y</li>
                        <li className='cursor-pointer px-2 py-1 hover:text-blue-500'>ALL</li>
                    </ul>
                </div>
            </div>

            {/* Conditional Rendering based on activeTab state */}
            {activeTab === 'stock' ? (
                <Stock />
            ) : (
                <Crypto />
            )}
        </div>
    );
};

export default Dashboard;