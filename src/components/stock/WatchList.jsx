import { useCallback, useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';


const FINNHUB_API_KEY = 'd0mv1i1r01qmjqmjlhrgd0mv1i1r01qmjqmjlhs0'; 

// Define the stock symbols you want to display
const STOCK_SYMBOLS = [
    { id: 'AAPL', name: 'Apple Inc.' },
    { id: 'MSFT', name: 'Microsoft Corp.' },
    { id: 'GOOGL', name: 'Alphabet Inc. (Class A)' },
    { id: 'AMZN', name: 'Amazon.com Inc.' },
    { id: 'TSLA', name: 'Tesla Inc.' },
];

// Cache key for localStorage for Watchlist
const CACHE_KEY_WATCHLIST = 'watchlistStocks';
const CACHE_EXPIRY_MS_WATCHLIST = 5 * 60 * 1000; // 5 minutes in milliseconds

const Watchlist = () => {
    const [stockData, setStockData] = useState({}); // Store data as an object by symbol
    const [loading, setLoading] = useState(true); // Initial loading state for *first* data load
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isFetchingNewData, setIsFetchingNewData] = useState(false); // For background fetching indicator

    // Effect to detect dark mode
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

    const fetchStockQuote = useCallback(async (symbol) => {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
            }
            const data = await response.json();

            if (data && data.c !== undefined && data.pc !== undefined) {
                const currentPrice = data.c;
                const previousClose = data.pc;

                if (previousClose === null || previousClose === 0) {
                    return {
                        id: symbol.toLowerCase(),
                        symbol: symbol,
                        current_price: currentPrice,
                        price_change: 0,
                        price_change_percentage_24h: 0,
                    };
                }

                const priceChange = currentPrice - previousClose;
                const priceChangePercentage = (priceChange / previousClose) * 100;

                return {
                    id: symbol.toLowerCase(),
                    symbol: symbol,
                    current_price: currentPrice,
                    price_change: priceChange,
                    price_change_percentage_24h: priceChangePercentage,
                };
            } else {
                console.warn(`No valid quote data for ${symbol}:`, data);
                if (Object.keys(data).length === 0) {
                    console.error(`Finnhub: No data found for symbol ${symbol}. It might be invalid or restricted.`);
                }
                return null;
            }
        } catch (err) {
            console.error(`Failed to fetch data for ${symbol}:`, err);
            if (err.message.includes('API limit reached')) {
                throw new Error('API_LIMIT_REACHED');
            } else if (err.message.includes('Invalid API key')) {
                throw new Error('INVALID_API_KEY');
            } else {
                throw err;
            }
        }
    }, []);

    const fetchAndCacheAllStocks = useCallback(async (isBackgroundFetch = false) => {
        if (!isBackgroundFetch) {
            setLoading(true);
        } else {
            setIsFetchingNewData(true);
        }
        setError(null);
        const newStockData = {};
        let anyFailed = false;
        let globalError = null;

        for (const stock of STOCK_SYMBOLS) {
            try {
                const data = await fetchStockQuote(stock.id);
                if (data) {
                    newStockData[stock.id] = data;
                } else {
                    anyFailed = true;
                }
            } catch (err) {
                anyFailed = true;
                if (err.message === 'API_LIMIT_REACHED') {
                    globalError = 'Finnhub API Limit Reached. Data might be stale. Please wait a minute and refresh.';
                } else if (err.message === 'INVALID_API_KEY') {
                    globalError = 'Invalid Finnhub API Key. Please check your key.';
                } else {
                    globalError = `Error fetching data: ${err.message}`;
                }
                break; 
            }
            await new Promise(resolve => setTimeout(resolve, 2500)); 
        }

        setStockData(newStockData);
        if (Object.keys(newStockData).length > 0) {
            localStorage.setItem(CACHE_KEY_WATCHLIST, JSON.stringify({
                data: newStockData,
                timestamp: Date.now()
            }));
        }

        setLoading(false);
        setIsFetchingNewData(false);

        if (globalError) {
            setError(globalError);
        } else if (Object.keys(newStockData).length === 0 && anyFailed) {
            setError("Failed to load any stock data. Please check your Finnhub API key and console for details.");
        }
    }, [fetchStockQuote]);

    useEffect(() => {
        // 1. Try to load from cache immediately
        const cachedData = localStorage.getItem(CACHE_KEY_WATCHLIST);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < CACHE_EXPIRY_MS_WATCHLIST) {
                setStockData(data);
                setLoading(false); // Data loaded from cache
                console.log('Watchlist data loaded from cache.');
            } else {
                console.log('Cached watchlist data is stale. Fetching new data...');
            }
        } else {
            console.log('No cached watchlist data found. Fetching new data...');
        }

        // 2. Always trigger a background fetch (or initial fetch if no cache)
        const initialFetchDelay = cachedData ? 1000 : 500;
        const fetchTimeout = setTimeout(() => {
            fetchAndCacheAllStocks(true); // true for background fetch
        }, initialFetchDelay);

        // 3. Set up periodic fetching
        const intervalId = setInterval(() => {
            console.log('Periodically fetching new watchlist data...');
            fetchAndCacheAllStocks(true); // true for background fetch
        }, CACHE_EXPIRY_MS_WATCHLIST); // Fetch every 5 minutes

        return () => {
            clearTimeout(fetchTimeout);
            clearInterval(intervalId);
        };
    }, [fetchAndCacheAllStocks]);


    // Helper function to format change and include icon
    const formatChange = (stock) => {
        if (!stock || stock.price_change_percentage_24h === undefined || stock.price_change_percentage_24h === null) {
            return { display: 'N/A', type: 'neutral', icon: null };
        }

        const percentage = stock.price_change_percentage_24h;
        const displayValue = `${Math.abs(percentage).toFixed(2)}%`;

        const type = percentage >= 0 ? 'positive' : 'negative';
        const icon = percentage >= 0 ? <FaArrowUp className="inline w-2 ml-1 text-green-500" /> : <FaArrowDown className="inline w-2 ml-1 text-red-500" />;

        return { display: displayValue, type: type, icon: icon };
    };

    // Render logic
    if (loading && Object.keys(stockData).length === 0) {
        return <div className="p-4 min-h-screen text-center text-gray-500 dark:text-gray-400">Loading stock data...</div>;
    }

    if (error) {
        return <div className="p-4 min-h-screen text-center text-red-500 dark:text-red-400">Error: {error}</div>;
    }

    if (Object.keys(stockData).length === 0 && !loading) {
        return <div className="p-4 min-h-screen text-center text-gray-500 dark:text-gray-400">No stock data to display. Please check your API key or try again later.</div>;
    }

    return (
        <div className='bg-white p-5 dark:bg-gray-800 shadow-md rounded-lg w-full'>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Stock Watchlist
                {isFetchingNewData && (
                    <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">
                        (Updating...)
                    </span>
                )}
            </h3>

            <div className='space-y-4'>
                {STOCK_SYMBOLS.map((stockInfo) => {
                    const stock = stockData[stockInfo.id];
                    const change = formatChange(stock);

                    return (
                        <div key={stockInfo.id} className='flex items-center justify-between'>
                            <div className='flex items-center gap-5'>
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <span className={`font-bold text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {stockInfo.id.substring(0, 1)}
                                    </span>
                                </div>
                                <div>
                                    <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stockInfo.id.toUpperCase()}</h1>
                                    <h6 className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stockInfo.name}</h6>
                                </div>
                            </div>
                            <div>
                                <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {stock ? `$${stock.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                                </h1>
                                <div className='flex gap-1 items-center'>
                                    <p className='mb-1'>{change.icon}</p>
                                    <p className={`text-[9px] ${change.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                                        {change.display}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Watchlist;