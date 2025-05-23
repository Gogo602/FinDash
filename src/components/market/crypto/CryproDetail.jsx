import  { useEffect, useState, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { ThemeContext } from '../../../context/ThemeContextProvider'; 


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const COINGECKO_API_KEY = 'CG-t1v39nhdWBNciCQEnkYDnR2K'; 

const CryptoDetail = () => {
    const { coinId } = useParams(); // Get the coin ID from the URL
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    const [coinDetails, setCoinDetails] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('30'); // Default to 30 days

    // Function to fetch coin details
    const fetchCoinDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-cg-demo-api-key': COINGECKO_API_KEY
                }
            };
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch details for ${coinId}: ${response.statusText}`);
            }
            const data = await response.json();
            setCoinDetails(data);
        } catch (err) {
            console.error("Error fetching coin details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [coinId]);

    // Function to fetch historical chart data
    const fetchChartData = useCallback(async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-cg-demo-api-key': COINGECKO_API_KEY
                }
            };
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${timeframe}`, options);
            if (!response.ok) {
                throw new Error(`Failed to fetch chart data for ${coinId}: ${response.statusText}`);
            }
            const data = await response.json();
            setChartData(data.prices); 
        } catch (err) {
            console.error("Error fetching chart data:", err);
            
        }
    }, [coinId, timeframe]);

    useEffect(() => {
        if (coinId) {
            fetchCoinDetails();
            fetchChartData();
        }
    }, [coinId, fetchCoinDetails, fetchChartData]);

    // Format chart data for Chart.js
    const chartJsData = {
        labels: chartData.map(data => {
            const date = new Date(data[0]);
            return date.toLocaleDateString(); 
        }),
        datasets: [
            {
                label: `Price (${coinDetails?.symbol.toUpperCase() || ''})`,
                data: chartData.map(data => data[1]), // Extract prices
                borderColor: isDarkMode ? '#82b1ff' : '#42a5f5', 
                backgroundColor: isDarkMode ? 'rgba(130, 177, 255, 0.2)' : 'rgba(66, 165, 245, 0.2)',
                tension: 0.4,
                fill: true,
                pointRadius: 0, 
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: isDarkMode ? '#e0e0e0' : '#333'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
            title: {
                display: true,
                text: `${coinDetails?.name || 'Crypto'} Price History`,
                color: isDarkMode ? '#e0e0e0' : '#333'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: isDarkMode ? '#bdbdbd' : '#666',
                    autoSkip: true,
                    maxTicksLimit: 10 // Limit number of ticks on x-axis
                },
                grid: {
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
            },
            y: {
                ticks: {
                    color: isDarkMode ? '#bdbdbd' : '#666',
                    callback: function (value) {
                        return `$${value.toLocaleString()}`; // Format Y-axis labels as currency
                    }
                },
                grid: {
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
            },
        },
    };

    if (loading) {
        return (
            <div className={`p-6 min-h-screen text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-16`}>
                Loading {coinId} details...
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-6 min-h-screen text-center ${isDarkMode ? 'text-red-400' : 'text-red-500'} mt-16`}>
                Error: {error}
                <button
                    onClick={() => navigate('/market')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Back to Market
                </button>
            </div>
        );
    }

    if (!coinDetails) {
        return (
            <div className={`p-6 min-h-screen text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-16`}>
                Coin details not found.
            </div>
        );
    }

    return (
        <div className={`py-6 px-4 md:pl-40 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen mt-16`}>
            <div className=" mb-6">
                <button
                    onClick={() => navigate('/market')}
                    className={`mr-4 px-4 py-2 rounded-md transition-colors
                                ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    &larr; Back to Market
                </button>
                {coinDetails.image?.large && (
                    <img src={coinDetails.image.large} alt={coinDetails.name} className="w-16 h-16 rounded-full mr-4 mt-5" />
                )}
                <div className=''>
                    <h1 className="text-4xl font-bold">{coinDetails.name} <span className="text-gray-400 text-2xl">({coinDetails.symbol.toUpperCase()})</span></h1>
                    {coinDetails.market_cap_rank && (
                        <p className="text-xl mt-1">Rank: #{coinDetails.market_cap_rank}</p>
                    )}
                </div>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                    <p className="text-2xl font-bold mt-1">${coinDetails.market_data?.current_price?.usd?.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">24h High</p>
                    <p className="text-xl font-bold mt-1 text-green-500">${coinDetails.market_data?.high_24h?.usd?.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">24h Low</p>
                    <p className="text-xl font-bold mt-1 text-red-500">${coinDetails.market_data?.low_24h?.usd?.toLocaleString()}</p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                    <p className="text-xl font-bold mt-1">${coinDetails.market_data?.market_cap?.usd?.toLocaleString()}</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className={`mb-8 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-2xl font-semibold mb-4">Price Chart</h3>
                <div className="flex justify-center md:justify-start space-x-2 mb-4">
                    {['7', '14', '30', '90', '180', '365', 'max'].map((days) => (
                        <button
                            key={days}
                            onClick={() => setTimeframe(days)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                                ${timeframe === days
                                    ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                    : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                }`}
                        >
                            {days === 'max' ? 'Max' : `${days}D`}
                        </button>
                    ))}
                </div>
                <div className="chart-container h-64 md:h-96">
                    {chartData.length > 0 ? (
                        <Line data={chartJsData} options={chartOptions} />
                    ) : (
                        <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} py-10`}>
                            No chart data available for selected timeframe.
                        </p>
                    )}
                </div>
            </div>

            {/* Coin Description */}
            {coinDetails.description?.en && (
                <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-2xl font-semibold mb-4">About {coinDetails.name}</h3>
                    <div
                        className={`prose max-w-none ${isDarkMode ? 'prose-invert text-gray-300' : 'text-gray-800'}`}
                        dangerouslySetInnerHTML={{ __html: coinDetails.description.en }}
                    />
                </div>
            )}
        </div>
    );
};

export default CryptoDetail;