import { useEffect, useState, useCallback, useContext } from 'react';
import { FaArrowUp, FaArrowDown, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../context/ThemeContextProvider';

const COINGECKO_API_KEY = 'CG-t1v39nhdWBNciCQEnkYDnR2K';

const CryptoMarket = () => {
    const [allCoins, setAllCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const isDarkMode = theme === 'dark';

    const fetchAllCoins = useCallback(async () => {
        setLoading(true);
        setError(null);

        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-cg-demo-api-key': COINGECKO_API_KEY
            }
        };

        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en', options);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
            }
            const data = await response.json();
            setAllCoins(data);
        } catch (err) {
            console.error("Failed to fetch coins:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllCoins();
    }, [fetchAllCoins]);

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

    const formatLargeNumber = (num) => {
        if (num === undefined || num === null) return 'N/A';
        return `$${num.toLocaleString('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 2
        })}`;
    };

    const handleCoinClick = (coinId) => {
        if (coinId) {
            navigate(`/crypto/${coinId}`);
        }
    };

    const filteredCoins = allCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const coinsToDisplay = filteredCoins.slice(0, 50);

    if (loading) {
        return (
            <div className={`p-4 min-h-screen text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-16`}>
                <p>Loading crypto market data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-4 min-h-screen text-center ${isDarkMode ? 'text-red-400' : 'text-red-500'} mt-16`}>
                <p>Error: {error}</p>
                <p className="text-sm">Please check your CoinGecko API key and internet connection.</p>
            </div>
        );
    }

    return (
        <div className={`p-4 ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-16`}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h2 className="text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">Top 50 Cryptocurrencies</h2>
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search coins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full py-2 px-4 pl-10 rounded-full border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
            </div>

            <div className={`overflow-x-auto rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {coinsToDisplay.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Rank</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Coin</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">24h Change</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hidden md:table-cell">24h Volume</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 hidden md:table-cell">Market Cap</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {coinsToDisplay.map((coin) => {
                                const changeData = formatChangePercentage(coin.price_change_percentage_24h);
                                return (
                                    <tr
                                        key={coin.id}
                                        className={`
                                            ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                                            ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
                                            cursor-pointer
                                        `}
                                        onClick={() => handleCoinClick(coin.id)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{coin.market_cap_rank}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center">
                                                <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full mr-3" />
                                                <span className="font-semibold">{coin.name}</span>
                                                <span className={`ml-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({coin.symbol.toUpperCase()})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${changeData.class}`}>
                                            {changeData.display} {changeData.icon}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">{formatLargeNumber(coin.total_volume)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm hidden md:table-cell">{formatLargeNumber(coin.market_cap)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className={`p-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No cryptocurrencies match your search.
                    </div>
                )}
            </div>
            <p className={`mt-4 text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Data provided by CoinGecko. Prices are delayed for free API users.
            </p>
        </div>
    );
};

export default CryptoMarket;