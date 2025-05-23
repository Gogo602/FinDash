import React, { useEffect, useState, useCallback, useContext } from 'react';
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

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const FINNHUB_API_KEY = 'd0mv1i1r01qmjqmjlhrgd0mv1i1r01qmjqmjlhs0'; 

const StockDetail = () => {
    const { symbol } = useParams(); 
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const isDarkMode = theme === 'dark';

    const [stockDetails, setStockDetails] = useState(null); 
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('30'); // Default to 30 days

    // Helper to convert days to Unix timestamp difference
    const getUnixTimestampDifference = (days) => {
        const now = Math.floor(Date.now() / 1000);
        let past;
        if (days === 'max') {
            past = now - (1825 * 24 * 60 * 60); // 5 years ago
        } else {
            past = now - (parseInt(days) * 24 * 60 * 60);
        }
        return { from: past, to: now };
    };

    
    const fetchStockDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // validate api key
            if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
                throw new Error('Finnhub API Key is missing or invalid. Please replace YOUR_FINNHUB_API_KEY in StockDetail.jsx with your actual Finnhub API Key.');
            }

            // Fetch profile and quote in parallel
            const [profileResponse, quoteResponse] = await Promise.all([
                fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`),
                fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`)
            ]);
            
            if (!profileResponse.ok) {
                const profileErrorText = await profileResponse.text();
                throw new Error(`Failed to fetch profile for ${symbol}: ${profileResponse.status} - ${profileErrorText}`);
            }
            if (!quoteResponse.ok) {
                 const quoteErrorText = await quoteResponse.text();
                throw new Error(`Failed to fetch quote for ${symbol}: ${quoteResponse.status} - ${quoteErrorText}`);
            }

            const profile = await profileResponse.json();
            const quote = await quoteResponse.json();

            if (Object.keys(profile).length === 0 || Object.keys(quote).length === 0 || !quote.c) {
                throw new Error(`No complete data found for symbol: ${symbol}. It might be invalid or not available on your API tier.`);
            }

            setStockDetails({ ...profile, ...quote }); 
        } catch (err) {
            console.error("Error fetching stock details:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [symbol, FINNHUB_API_KEY]); 

    // Function to fetch historical chart data (candles)
    const fetchChartData = useCallback(async () => {
        try {
            if (!FINNHUB_API_KEY || FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
                return; 
            }
            
            const { from, to } = getUnixTimestampDifference(timeframe);
            const resolution = 'D'; 
            const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Finnhub Candle API Error for ${symbol}: ${response.status} - ${errorText}`);
                throw new Error(`Failed to fetch chart data for ${symbol}: ${response.statusText}`);
            }
            const data = await response.json();

            if (data && data.c && data.t && data.c.length > 0) {
                const formattedData = data.t.map((timestamp, index) => [
                    timestamp * 1000, // Convert to milliseconds
                    data.c[index]      // Close price
                ]);
                setChartData(formattedData);
            } else {
                setChartData([]); 
            }
        } catch (err) {
            console.error("Error fetching stock chart data:", err);
            setChartData([]); 
        }
    }, [symbol, timeframe, FINNHUB_API_KEY]); 

    useEffect(() => {
        if (symbol) {
            fetchStockDetails();
            fetchChartData();
        }
    }, [symbol, timeframe, fetchStockDetails, fetchChartData]);


    const chartJsData = {
        labels: chartData.map(data => {
            const date = new Date(data[0]);
            return date.toLocaleDateString(); // Format timestamp to date string
        }),
        datasets: [
            {
                label: `Price (${stockDetails?.ticker || ''})`,
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
                text: `${stockDetails?.name || symbol} Price History`,
                color: isDarkMode ? '#e0e0e0' : '#333'
            }
        },
        scales: {
            x: {
                ticks: {
                    color: isDarkMode ? '#bdbdbd' : '#666',
                    autoSkip: true,
                    maxTicksLimit: 10
                },
                grid: {
                    color: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
            },
            y: {
                ticks: {
                    color: isDarkMode ? '#bdbdbd' : '#666',
                    callback: function (value) {
                        return `$${value.toLocaleString()}`;
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
                Loading {symbol} details...
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-6 min-h-screen text-center ${isDarkMode ? 'text-red-400' : 'text-red-500'} mt-16`}>
                <p>Error: {error}</p>
                {error.includes('Finnhub API Key') && (
                    <p className="text-sm">Please get your API key from <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="underline">finnhub.io</a> and replace in StockDetail.jsx.</p>
                )}
                {error.includes('Failed to fetch') && !error.includes('Finnhub API Key') && (
                    <p className="text-sm">This could be due to Finnhub API rate limits or an invalid stock symbol. Please try again in a minute.</p>
                )}
                <button
                    onClick={() => navigate('/stocks')} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Back to Stock Market
                </button>
            </div>
        );
    }

    if (!stockDetails || !stockDetails.name) {
        return (
            <div className={`p-6 min-h-screen text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-16`}>
                Stock details not found for {symbol}.
                <button
                    onClick={() => navigate('/stocks')} 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Back to Stock Market
                </button>
            </div>
        );
    }

    return (
        <div className={`py-6 px-4 md:pl-40 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen mt-16`}>
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate('/market')} 
                    className={`mr-4 px-4 py-2 rounded-md transition-colors
                                ${isDarkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                    &larr; Back to Market
                </button>
                {stockDetails.logo && (
                    <img src={stockDetails.logo} alt={stockDetails.name} className="w-16 h-16 mr- mt-5 object-contain" />
                )}
                <div>
                    <h1 className="text-4xl font-bold">{stockDetails.name} <span className="text-gray-400 text-2xl">({stockDetails.ticker || symbol})</span></h1>
                    {stockDetails.exchange && (
                        <p className="text-xl mt-1">Exchange: {stockDetails.exchange}</p>
                    )}
                </div>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                    <p className="text-2xl font-bold mt-1">${stockDetails.c?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Day High</p>
                    <p className="text-xl font-bold mt-1 text-green-500">${stockDetails.h?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Day Low</p>
                    <p className="text-xl font-bold mt-1 text-red-500">${stockDetails.l?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Open Price</p>
                    <p className="text-xl font-bold mt-1">${stockDetails.o?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Previous Close</p>
                    <p className="text-xl font-bold mt-1">${stockDetails.pc?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                </div>
                 <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                    <p className="text-xl font-bold mt-1">{stockDetails.marketCapitalization ? `$${(stockDetails.marketCapitalization).toLocaleString('en-US', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 2 })}` : 'N/A'}</p>
                </div>
                 <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                    <p className="text-xl font-bold mt-1">{stockDetails.finnhubIndustry || 'N/A'}</p>
                </div>
                 <div className={`p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">IPO Date</p>
                    <p className="text-xl font-bold mt-1">{stockDetails.ipo || 'N/A'}</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className={`mb-8 p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-2xl font-semibold mb-4">Price Chart</h3>
                <div className="flex justify-center md:justify-start space-x-2 mb-4">
                    {['7', '30', '90', '180', '365', 'max'].map((days) => (
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
                            No chart data available for selected timeframe or symbol. Finnhub free tier historical data is limited.
                        </p>
                    )}
                </div>
            </div>

            {/* Company Details (Description) */}
            {stockDetails.description && (
                <div className={`p-6 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="text-2xl font-semibold mb-4">About {stockDetails.name}</h3>
                    <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stockDetails.description}</p>
                </div>
            )}
        </div>
    );
};

export default StockDetail;