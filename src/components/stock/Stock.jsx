import React, { useEffect, useState, useCallback } from 'react';
import Card from '../Card'; 
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import StockChart from './StockChart';
import Watchlist from './WatchList';
import MarketOverview from './MarketOverview';

const FINNHUB_API_KEY = 'd0mv1i1r01qmjqmjlhrgd0mv1i1r01qmjqmjlhs0';

const StockDashboard = () => {
    const [stockData, setStockData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    // Function to fetch a single stock's global quote from Finnhub
    const fetchStockQuote = useCallback(async (symbol) => {
        if (!FINNHUB_API_KEY) {
            console.error("Finnhub API Key is not set. Please add REACT_APP_FINNHUB_API_KEY to your .env file.");
            setError("API Key not configured. Please check your .env file.");
            return null;
        }

        // Finnhub Quote endpoint
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({})); // Attempt to parse JSON error
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.error || response.statusText}`);
            }
            const data = await response.json();

            
            if (data && typeof data.c === 'number' && data.c !== 0) { // Check if 'c' (current price) is a valid number and not zero
                const currentPrice = data.c;
                const previousClose = data.pc; // previous close

                if (previousClose === 0 || isNaN(previousClose)) {
                    // Handle cases where previousClose might be 0 or N/A (e.g., brand new stock)
                    return {
                        symbol: symbol,
                        price: currentPrice,
                        change: 0, // Cannot calculate change
                        changePercent: 0, // Cannot calculate change percent
                    };
                }

                const change = currentPrice - previousClose;
                const changePercent = (change / previousClose) * 100;

                return {
                    symbol: symbol,
                    price: currentPrice,
                    change: change,
                    changePercent: changePercent,
                };
            } else {
                // If Finnhub returns an error message (e.g., invalid symbol, limit)
                if (data.error) {
                    console.error(`Finnhub API Error for ${symbol}: ${data.error}`);
                    setError(prev => prev ? `${prev}, ${symbol}: ${data.error}` : `${symbol}: ${data.error}`);
                } else {
                    console.warn(`No valid quote data found for ${symbol} (Finnhub API response):`, data);
                }
                return null;
            }
        } catch (err) {
            console.error(`Failed to fetch data for ${symbol} (network/parse error):`, err);
            setError(prev => prev ? `${prev}, ${symbol}: ${err.message}` : `${symbol}: ${err.message}`);
            return null;
        }
    }, []); 

    useEffect(() => {
        // We can fetch all 4 again with Finnhub's better per-minute limit
        const symbolsToFetch = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];

        const fetchAllStockQuotes = async () => {
            setLoading(true);
            setError(null); // Clear previous errors
            const newStockData = {};
            // Use Promise.all to fetch all quotes concurrently for efficiency
            await Promise.all(symbolsToFetch.map(async (symbol) => {
                const data = await fetchStockQuote(symbol);
                if (data) {
                    newStockData[symbol] = data;
                }
            }));
            setStockData(newStockData);
            setLoading(false);
        };

       
        const timeoutId = setTimeout(fetchAllStockQuotes, 100); 

        return () => clearTimeout(timeoutId); 
    }, [fetchStockQuote]); 

    // Helper function to format change and include icon
    const formatChange = (stock) => {
        if (!stock || (stock.changePercent === undefined || stock.changePercent === null || isNaN(stock.changePercent))) {
            return { display: 'N/A', type: 'neutral', icon: null };
        }

        const percentage = stock.changePercent;
        // Ensure displayValue always shows 2 decimal places, even if it's 0.00
        const displayValue = `${Math.abs(percentage).toFixed(2)}%`;

        const iconColorClass = percentage >= 0
            ? (isDarkMode ? 'text-green-400' : 'text-green-500')
            : (isDarkMode ? 'text-red-400' : 'text-red-500');

        const type = percentage >= 0 ? '+' : '-'; // String for Card component's changeType
        const icon = percentage >= 0 ? <FaArrowUp className={`inline ml-1 ${iconColorClass}`} /> : <FaArrowDown className={`inline ml-1 ${iconColorClass}`} />;

        return { display: displayValue, type: type, icon: icon };
    };

    if (loading) {
        return <div className="p-4 min-h-screen text-center text-gray-500 dark:text-gray-400">Loading stock data...</div>;
    }

    if (error) {
        return <div className="p-4 min-h-screen text-center text-red-500 dark:text-red-400">Error: {error}</div>;
    }

   
    const apple = stockData['AAPL'];
    const microsoft = stockData['MSFT'];
    const google = stockData['GOOGL']; 
    const amazon = stockData['AMZN'];

    const appleChange = formatChange(apple);
    const microsoftChange = formatChange(microsoft);
    const googleChange = formatChange(google);
    const amazonChange = formatChange(amazon);

    return (
        <div className='w-full  space-y-6'>
            <div>
                {/* Stock Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <Card
                        icon={<img src="https://companiesmarketcap.com/img/company-logos/256/AAPL.webp" alt="Apple logo" className="w-8 h-8 rounded-full" />}
                        title="Apple (AAPL)"
                        value={apple ? `$${apple.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                        change={appleChange.display}
                        changeType={appleChange.type}
                        changeIcon={appleChange.icon}
                    />
                    <Card
                        icon={<img src="https://companiesmarketcap.com/img/company-logos/256/MSFT.webp" alt="Microsoft logo" className="w-8 h-8 rounded-full" />}
                        title="Microsoft (MSFT)"
                        value={microsoft ? `$${microsoft.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                        change={microsoftChange.display}
                        changeType={microsoftChange.type}
                        changeIcon={microsoftChange.icon}
                    />
                    <Card
                        icon={<img src="https://companiesmarketcap.com/img/company-logos/256/GOOG.webp" alt="Google logo" className="w-8 h-8 rounded-full" />}
                        title="Alphabet (GOOGL)"
                        value={google ? `$${google.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                        change={googleChange.display}
                        changeType={googleChange.type}
                        changeIcon={googleChange.icon}
                    />
                    <Card
                        icon={<img src="https://companiesmarketcap.com/img/company-logos/256/AMZN.webp" alt="Amazon logo" className="w-8 h-8 rounded-full" />}
                        title="Amazon (AMZN)"
                        value={amazon ? `$${amazon.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                        change={amazonChange.display}
                        changeType={amazonChange.type}
                        changeIcon={amazonChange.icon}
                    />
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6'>
                    <StockChart />
                     <Watchlist />
                </div>
                
                <div className=''>
                    <MarketOverview />
                </div>
            </div>
        </div>
    );
};

export default StockDashboard;