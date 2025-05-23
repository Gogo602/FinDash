import { useEffect, useState, useCallback, useContext } from 'react';
import { FaArrowUp, FaArrowDown, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../context/ThemeContextProvider';


const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 

const StockMarket = () => {
    const [hotStocks, setHotStocks] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const isDarkMode = theme === 'dark';

    // Fetch Hot Stocks (trending) from Finnhub
    const fetchHotStocks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Using a list of popular symbols and fetching their quotes for demonstration
            const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'BRK.B', 'JPM', 'V', 'PG', 'HD', 'MA', 'UNH', 'VZ', 'T'];
            const stockDataPromises = symbols.map(async (symbol) => {
                const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
                const profileResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);

                if (!quoteResponse.ok || !profileResponse.ok) {
                    throw new Error(`Failed to fetch data for ${symbol}`);
                }
                const quote = await quoteResponse.json();
                const profile = await profileResponse.json();

                return {
                    symbol: symbol,
                    name: profile.name || symbol, 
                    current_price: quote.c, 
                    open_price: quote.o,   
                    high_price: quote.h,   
                    low_price: quote.l,    
                    prev_close: quote.pc,  
                    change: quote.d,       
                    percent_change: quote.dp, 
                    volume: quote.t,       
                };
            });

            const data = await Promise.all(stockDataPromises);
            setHotStocks(data.filter(stock => stock.current_price > 0)); 
        } catch (err) {
            console.error("Failed to fetch stocks:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []); 

    const fetchAllStocks = useCallback(async () => {
        await fetchHotStocks();
    }, [fetchHotStocks]);

    useEffect(() => {
        if (FINNHUB_API_KEY === 'YOUR_FINNHUB_API_KEY') {
            setError('Please replace YOUR_FINNHUB_API_KEY in StockMarket.jsx with your actual Finnhub API Key.');
            setLoading(false);
            return;
        }
        fetchAllStocks();
    }, [fetchAllStocks]);

  


    const formatChangePercentage = (percentage) => {
        if (percentage === undefined || percentage === null) {
            return { display: 'N/A', class: 'text-gray-500', icon: null };
        }

        const value = percentage.toFixed(2);
        const isPositive = percentage >= 0;
        const classColor = isPositive ? 'text-green-500' : 'text-red-500';
        const icon = isPositive ? <FaArrowUp className="inline ml-1 text-green-500" /> : <FaArrowDown className="inline ml-1 text-red-500" />;

        return {
            display: `${Math.abs(value)}%`,
            class: classColor,
            icon: icon
        };
    };

    const formatPrice = (price) => {
        if (price === undefined || price === null) return 'N/A';
        return `$${price.toFixed(2)}`;
    };

    const formatVolume = (volume) => {
        if (volume === undefined || volume === null) return 'N/A';
        return volume.toLocaleString('en-US');
    };

    // Filtered stocks based on searchQuery
    const filteredStocks = hotStocks.filter(stock =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stocksToDisplay = filteredStocks.slice(0, 50); // Still slice to 50, even if we fetch less

    const handleStockClick = (symbol) => {
        if (symbol) {
            navigate(`/stocks/${symbol}`); 
        }
    };

    if (loading) {
        return (
            <div className={`p-4 min-h-screen text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-16`}>
                <p>Loading stock market data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 min-h-screen text-center ${isDarkMode ? 'text-red-400' : 'text-red-500'} mt-16`}>
                <p>Error: {error}</p>
                {error.includes('Finnhub API Key') && (
                    <p className="text-sm">Please get your API key from <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="underline">finnhub.io</a> and replace in StockMarket.jsx.</p>
                )}
            </div>
        );
    }

    return (
        <div className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-16`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">Popular Stocks</h2>

                {/* Search Bar */}
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search stocks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full py-2 px-4 pl-10 rounded-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
            </div>

            <div className={`overflow-x-auto rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {stocksToDisplay.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Symbol</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Company Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">24h Change (%)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Volume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {stocksToDisplay.map((stock) => {
                                const changeData = formatChangePercentage(stock.percent_change);
                                return (
                                    <tr
                                        key={stock.symbol}
                                        className={`
                                            ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                                            ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
                                            cursor-pointer
                                        `}
                                        onClick={() => handleStockClick(stock.symbol)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{stock.symbol}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{stock.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatPrice(stock.current_price)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${changeData.class}`}>
                                            {changeData.display} {changeData.icon}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{formatVolume(stock.volume)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No stocks match your search or data is not available.
                    </div>
                )}
            </div>
            <p className={`mt-4 text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Stock data provided by Finnhub. Free tier data may be delayed.
            </p>
        </div>
    );
};

export default StockMarket;