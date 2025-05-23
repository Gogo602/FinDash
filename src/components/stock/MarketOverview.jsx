import { useCallback, useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';


const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY; 

// Define a broader list of well-known stock symbols
const MARKET_STOCKS = [
    { id: 'AAPL', name: 'Apple Inc.' },
    { id: 'MSFT', name: 'Microsoft Corp.' },
    { id: 'GOOGL', name: 'Alphabet Inc. (Class A)' },
    { id: 'AMZN', name: 'Amazon.com Inc.' },
    { id: 'TSLA', name: 'Tesla Inc.' },
    { id: 'NVDA', name: 'NVIDIA Corp.' },
    { id: 'JPM', name: 'JPMorgan Chase & Co.' },
    { id: 'V', name: 'Visa Inc.' },
    { id: 'UNH', name: 'UnitedHealth Group' },
    { id: 'HD', name: 'The Home Depot, Inc.' },
    { id: 'META', name: 'Meta Platforms Inc.' },
    { id: 'BRK.A', name: 'Berkshire Hathaway Inc. (Class A)' },
    { id: 'NFLX', name: 'Netflix Inc.' },
    { id: 'ADBE', name: 'Adobe Inc.' },
    { id: 'CRM', name: 'Salesforce Inc.' },
    { id: 'INTC', name: 'Intel Corp.' },
];

// Cache key for localStorage
const CACHE_KEY = 'marketOverviewStocks';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

const MarketOverview = () => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true); // Initial loading state for *first* data load
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isFetchingNewData, setIsFetchingNewData] = useState(false); // For background fetching indicator

    // Effect to detect dark mode
    useEffect(() => {
        const detectDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains('dark'));
        };
        detectDarkMode();
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
              const volume = data.t;
            

                if (previousClose === null || previousClose === 0) {
                    return {
                        id: symbol,
                        symbol: symbol,
                        current_price: currentPrice,
                        price_change: 0,
                        price_change_percentage_24h: 0,
                        total_volume: volume,
                  };

                }

                const priceChange = currentPrice - previousClose;
                const priceChangePercentage = (priceChange / previousClose) * 100;

                return {
                    id: symbol,
                    symbol: symbol,
                    current_price: currentPrice,
                    price_change: priceChange,
                    price_change_percentage_24h: priceChangePercentage,
                    total_volume: volume,
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
                
                throw new Error('API_LIMIT_REACHED'); // Custom error type for handling
            } else if (err.message.includes('Invalid API key')) {
                throw new Error('INVALID_API_KEY'); // Custom error type for handling
            } else {
                throw err; // Re-throw other errors
            }
        }
    }, []);

    const fetchAndCacheAllMarketStocks = useCallback(async (isBackgroundFetch = false) => {
        if (!isBackgroundFetch) { // Only show full loading spinner for initial load
            setLoading(true);
        } else {
            setIsFetchingNewData(true); // Show a subtle indicator for background fetch
        }
        setError(null);
        const fetchedStockData = [];
        let anyFailed = false;
        let globalError = null;

        for (const stockInfo of MARKET_STOCKS) {
            try {
                const data = await fetchStockQuote(stockInfo.id);
                if (data) {
                    fetchedStockData.push({ ...stockInfo, ...data });
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
                // Stop fetching if a critical error like invalid key or limit is hit
                break;
            }
            // Add a delay between requests to manage Finnhub's 30 req/min limit (2s per call)
            await new Promise(resolve => setTimeout(resolve, 2500));
        }

        fetchedStockData.sort((a, b) => {
            const aChange = a.price_change_percentage_24h ?? -Infinity;
            const bChange = b.price_change_percentage_24h ?? -Infinity;
            return bChange - aChange;
        });

        // Update state and cache
        setStocks(fetchedStockData);
        if (fetchedStockData.length > 0) {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: fetchedStockData,
                timestamp: Date.now()
            }));
        }

        setLoading(false);
        setIsFetchingNewData(false);

        if (globalError) {
            setError(globalError);
        } else if (fetchedStockData.length === 0 && anyFailed) {
            setError("Failed to load any stock data for market overview. Please check your Finnhub API key and console for details.");
        }
    }, [fetchStockQuote]);

    useEffect(() => {
        // 1. Try to load from cache immediately
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            // Check if cache is still valid
            if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
                setStocks(data);
                setLoading(false); // Data loaded from cache, no initial loading spinner
                
            } else {
                console.log('Cached market data is stale. Fetching new data...');
            }
        } else {
            console.log('No cached market data found. Fetching new data...');
        }

        // 2. Always trigger a background fetch (or initial fetch if no cache)
        const initialFetchDelay = cachedData ? 1000 : 500; // Shorter delay if showing cached data first
        const fetchTimeout = setTimeout(() => {
            fetchAndCacheAllMarketStocks(true); // true for background fetch
        }, initialFetchDelay);


        // 3. Set up periodic fetching
        const intervalId = setInterval(() => {
            fetchAndCacheAllMarketStocks(true); // true for background fetch
        }, CACHE_EXPIRY_MS); // Fetch every 5 minutes

        return () => {
            clearTimeout(fetchTimeout);
            clearInterval(intervalId); // Clean up interval on unmount
        };
    }, [fetchAndCacheAllMarketStocks]);

    // Helper function to format large numbers (e.g., 1,000,000 to 1M)
    const formatVolume = (num) => {
        if (num === null || num === undefined) return 'N/A';
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(2) + 'B';
        }
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(2) + 'M';
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(2) + 'K';
        }
        return num.toLocaleString();
    };

    const formatChange = (stock) => {
        if (!stock || (stock.price_change_percentage_24h === undefined || stock.price_change_percentage_24h === null)) {
            return { display: 'N/A', type: 'neutral', icon: null };
        }

        const percentage = stock.price_change_percentage_24h;
        const displayValue = `${Math.abs(percentage).toFixed(2)}%`;

        const type = percentage >= 0 ? 'positive' : 'negative';
        const icon = percentage >= 0 ? <FaArrowUp className="inline w-3 ml-1 text-green-600" /> : <FaArrowDown className="inline w-3 ml-1 text-red-600" />;

        return { display: displayValue, type: type, icon: icon };
    };

    // Determine text colors based on theme
    const primaryTextColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';

    if (loading && stocks.length === 0) {
        return <div className="p-4 min-h-screen text-center text-gray-500 dark:text-gray-400">Loading initial market data...</div>;
    }

    if (error) {
        return <div className="p-4 min-h-screen text-center text-red-500 dark:text-red-400">Error: {error}</div>;
    }

    if (stocks.length === 0 && !loading) {
        return <div className="p-4 min-h-screen text-center text-gray-500 dark:text-gray-400">No stock market overview data to display. Please check your Finnhub API key or try again later.</div>;
    }

    return (
        <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg'>
            <h3 className={`text-lg font-semibold mb-4 ${primaryTextColor}`}>Stock Market Overview</h3>
            <p className={`text-sm font-semibold mb-2 ${primaryTextColor}`}>
                Top Performing Stocks (Last 24h)
                {isFetchingNewData && (
                    <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">
                        (Updating...)
                    </span>
                )}
            </p>
            <div className='space-y-2 pt-5'>
                {/* Table Header */}
                <div className={`flex items-center justify-between font-bold text-sm ${primaryTextColor}`}>
                    <p className="w-1/6 text-left">Rank</p>
                    <h1 className="w-2/6 text-left">Symbol</h1>
                    <p className="w-2/6 text-center">Change (24h)</p>
                    <p className="w-1/6 text-right">Volume</p>
                </div>

                {/* Dynamic Rows based on fetched and sorted data */}
                {stocks.map((stock, index) => {
                    const changeData = formatChange(stock);
                    return (
                        <div key={stock.id} className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${secondaryTextColor}`}>
                            <p className="w-1/6 text-left">{index + 1}</p>
                            <h1 className={`w-2/6 text-left font-medium ${primaryTextColor}`}>{stock.symbol}</h1>
                            <div className='flex gap-1 items-center w-2/6 justify-center'>
                                <p className='mb-1'>{changeData.icon}</p>
                                <p className={` ${changeData.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{changeData.display}</p>
                            </div>
                            <p className="w-1/6 text-right">{formatVolume(stock.total_volume)}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MarketOverview;