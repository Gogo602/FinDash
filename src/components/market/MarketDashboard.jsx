import  { useState } from 'react'; 

import { FaPlus } from 'react-icons/fa';
import CryptoMarket from './crypto/CryptoMarket';



const MarketDashboard = () => {
    const [activeTab, setActiveTab] = useState('stock'); 

    const getButtonClasses = (tabName) => {
        return `p-1 rounded-md transition-colors px-4 font-bold duration-200 ease-in-out ${
            activeTab === tabName
                ? 'bg-blue-600 text-white dark:bg-blue-600' 
                : 'text-gray-800  dark:text-gray-200 hover:bg-blue-400 ' 
        }`;
    };

    return (
        <div className='w-full h-auto mt-16 md:pl-40 mb-10'>
            <div className='mt-8'>
                <div className='flex items-center justify-between py-8'>
                    <h1>Dashboard</h1>
                    <button className=' flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200'> <FaPlus className='mr-1'/>Add Assets</button>
                </div>
                <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center p-1 space-x-1 text-sm bg-white dark:bg-gray-800 rounded-md shadow-sm'> {/* Added shadow-sm */}
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
                   
                    <ul className='flex items-center space-x-1 text-blue-50 text-sm sm:text-md'>
                        <li className='cursor-pointer px-1 bg-blue-600 rounded-sm sm:px-2 sm:py-1'>1D</li>
                        <li className='cursor-pointer px-1 bg-blue-600 rounded-sm sm:px-2 sm:py-1'>1W</li>
                        <li className='cursor-pointer px-1 bg-blue-600 rounded-sm sm:px-2 sm:py-1'>1M</li>
                        <li className='cursor-pointer px-1 bg-blue-600 rounded-sm sm:px-2 sm:py-1'>1Y</li>
                        <li className='cursor-pointer px-1 bg-blue-600 rounded-sm sm:px-2 sm:py-1'>ALL</li>
                    </ul>
                </div>
            </div>

            
            {activeTab === 'stock' ? (
                <p>stock</p>
            ) : (
               <CryptoMarket />
            )}
        </div>
    );
};

export default MarketDashboard;