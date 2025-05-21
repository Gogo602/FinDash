import React from 'react'
import Card from '../Card'
import { FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa';
import StockPerformanceChart from './StockChart';
import WatchList from './WatchList';
import MarketOverview from './MarketOverview';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js'; 
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend); 


const Stock = () => {
  return (
    <div className='flex w-full space-x-3 px-8'> {/* Added px-8 here instead of inner div */}
            <div className='grow'> {/* Removed redundant px-8 */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'> {/* Increased gap */}
                    <Card icon={<FaShoppingCart />} title="Total Value" value="$140k"/> {/* Better titles/values */}
                    <Card icon={<FaBox />} title="Total Stocks" value="500"/>
                    <Card icon={<FaUsers />} title="Market Cap Change" value="+3%"/>
                    <Card icon={<FaUsers />} title="Volume Traded" value="1.2M"/>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6'> {/* Increased gap */}
                    <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg'> {/* Added rounded-lg */}
                        <h3 className='text-lg font-semibold mb-2'>Stock Performance</h3>
                        <StockPerformanceChart />
                    </div>
                    <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg'>
                        <h3 className='text-lg font-semibold mb-2'>My Watchlist</h3>
                        <WatchList />
                    </div>
                </div>
                <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg'>
                    <h3 className='text-lg font-semibold mb-2'>Market Overview</h3>
                    <MarketOverview />
                </div>
            </div>
    </div>
  )
}

export default Stock