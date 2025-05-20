import Card from './Card'
import { FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa'
import {Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement} from 'chart.js'
import StockPerformanceChart from './stock/StockChart'
import WatchList from './stock/WatchList'
import MarketOverview from './stock/MarketOverview'




ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement)

const Dashboard = () => {
    return (
        <div className='w-full h-auto mt-16 mb-10'>
            <div className='mt-8 mx-8'>
                <div className='flex items-center justify-between py-8'>
                    <h1>Dashboard</h1>
                    <button>Add Assets</button>
                </div>
                <div className='flex items-center justify-between py-2'>
                    <div className='flex items-center'>
                        <button>Stock</button>
                        <button>Crypto</button>
                    </div>
                    <ul className='flex items-center'>
                        <li>1D</li>
                        <li>1W</li>
                        <li>1M</li>
                        <li>1Y</li>
                        <li>ALL</li>
                    </ul>
                </div>
            </div>
        <div className='flex w-full space-x-3'>
            <div className='grow px-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-6'>
                    <Card icon={<FaShoppingCart />} title="Total" value="140"/>
                    <Card icon={<FaBox />} title="Complete Session" value="120"/>
                    <Card icon={<FaUsers />} title="New Applicant" value="30"/>
                    <Card icon={<FaUsers />} title="New Applicant" value="30"/>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-6'>
                    <div className='bg-white p-1 dark:bg-gray-800  shadow-md'>
                            <StockPerformanceChart />
                    </div>
                    <div className='bg-white p-1 dark:bg-gray-800  shadow-md'>
                        <WatchList /> 
                    </div>
                </div>
                <div className='bg-white p-1 dark:bg-gray-800  shadow-md'>
                    <MarketOverview />    
                </div>
            </div>
        </div>
                
    </div>
  )
}

export default Dashboard;