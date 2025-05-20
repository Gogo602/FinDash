import Card from './Card'
import { FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa'
import {dataM } from '../assets/chartData'
import { Bar } from 'react-chartjs-2'
import {Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement} from 'chart.js'




ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement)

const Dashboard = () => {
    return (
    <div className='w-full h-auto mt-16'>
        <div className='flex w-full space-x-3'>
            <div className='grow px-8 w-2/3'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6'>
                    <Card icon={<FaShoppingCart />} title="Total" value="140"/>
                    <Card icon={<FaBox />} title="Complete Session" value="120"/>
                    <Card icon={<FaUsers />} title="New Applicant" value="30"/>
                </div>
                <div className=''>
                    <div className='bg-white p-1 dark:bg-gray-800  shadow-md'>
                        <h3 className='text-lg font-semibold mb-4'></h3>
                        <Bar data={dataM} />
                    </div>
                </div>  
            </div>
        </div>
                
    </div>
  )
}

export default Dashboard;