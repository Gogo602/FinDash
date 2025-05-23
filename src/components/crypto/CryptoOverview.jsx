import  { useCallback, useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';


const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY; 

const CryptoOverview = () => {
    const [allCoins, setAllCoins] = useState([]);
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
            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1', options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: response.statusText }));
                throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.error || errorData.message || 'Unknown error'}`);
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

    const bitcoin = allCoins.find(coin => coin.id === 'bitcoin');
    const ethereum = allCoins.find(coin => coin.id === 'ethereum');
    const tether = allCoins.find(coin => coin.id === 'tether');
    const ripple = allCoins.find(coin => coin.id === 'ripple');
    const binancecoin = allCoins.find(coin => coin.id === 'binancecoin');
    const solana = allCoins.find(coin => coin.id === 'solana');

    if (loading) {
        return <div className="p-4 min-h-screen text-center text-gray-500 dark:text-gray-400">Loading crypto data...</div>;
    }

    if (error) {
        return <div className="p-4 min-h-screen text-center text-red-500 dark:text-red-400">Error: {error}</div>;
    }

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

   
    const formatChange = (coin) => {
        if (!coin || (coin.price_change_percentage_24h === undefined || coin.price_change_percentage_24h === null)) {
            return { display: 'N/A', type: 'neutral', icon: null, volume: 'N/A', rank: 'N/A' };
        }

        const percentage = coin.price_change_percentage_24h;
        const volume = coin.total_volume;
        const rank = coin.market_cap_rank;

        const displayValue = `${Math.abs(percentage).toFixed(2)}%`;

        const type = percentage >= 0 ? 'positive' : 'negative';
        const icon = percentage >= 0 ? <FaArrowUp className="inline w-3 ml-1 text-green-600" /> : <FaArrowDown className="inline w-3 ml-1 text-red-600" />;

        return {
            display: displayValue,
            type: type,
            icon: icon,
            volume: formatVolume(volume), // Use the new formatVolume function
            rank: rank !== null && rank !== undefined ? rank : 'N/A' 
        };
    };

    const bitcoinData = formatChange(bitcoin); 
    const ethereumData = formatChange(ethereum);
    const rippleData = formatChange(ripple);
    const tetherData = formatChange(tether);
    const binancecoinData = formatChange(binancecoin);
    const solanaData = formatChange(solana);

    // Determine text colors based on theme
    const primaryTextColor = isDarkMode ? 'text-white' : 'text-gray-900';
    const secondaryTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';


    return (
        <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg'>
        <h3 className={`text-lg font-semibold mb-4 ${primaryTextColor}`}>Crypto Market Overview</h3>
        <p className={`text-sm font-semibold mb-4 ${primaryTextColor}`}>Top Performing Cryptocurrencies</p>
            <div className='space-y-2  pt-5'>
                {/* Table Header */}
                <div className={`flex items-center justify-between font-bold text-sm ${primaryTextColor}`}>
                    <p className="w-1/6 text-left">Rank</p>
                    <h1 className="w-2/6 text-left">Name</h1>
                    <p className="w-2/6 text-center">Change (24hr)</p>
                    <p className="w-1/6 text-right">Volume</p>
                </div>

                {/* Bitcoin Row */}
                <div className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${secondaryTextColor}`}>
                    <p className="w-1/6 text-left">{bitcoinData.rank}</p>
                    <h1 className={`w-2/6 text-left font-medium ${primaryTextColor}`}>BTC</h1>
                    <div className='flex gap-1 items-center w-2/6 justify-center'>
                        <p className='mb-1'>{bitcoinData.icon}</p>
                        <p className={` ${bitcoinData.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{bitcoinData.display}</p>
                    </div>
                    <p className="w-1/6 text-right">{bitcoinData.volume}</p>
                </div>

                {/* Ethereum Row */}
                <div className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${secondaryTextColor}`}>
                    <p className="w-1/6 text-left">{ethereumData.rank}</p>
                    <h1 className={`w-2/6 text-left font-medium ${primaryTextColor}`}>ETH</h1>
                    <div className='flex gap-1 items-center w-2/6 justify-center'>
                        <p className='mb-1'>{ethereumData.icon}</p>
                        <p className={` ${ethereumData.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{ethereumData.display}</p>
                    </div>
                    <p className="w-1/6 text-right">{ethereumData.volume}</p>
                </div>

                {/* Tether Row */}
                <div className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${secondaryTextColor}`}>
                    <p className="w-1/6 text-left">{tetherData.rank}</p>
                    <h1 className={`w-2/6 text-left font-medium ${primaryTextColor}`}>USDT</h1>
                    <div className='flex gap-1 items-center w-2/6 justify-center'>
                        <p className='mb-1'>{tetherData.icon}</p>
                        <p className={` ${tetherData.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{tetherData.display}</p>
                    </div>
                    <p className="w-1/6 text-right">{tetherData.volume}</p>
                </div>

                {/* Ripple Row */}
                <div className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${secondaryTextColor}`}>
                    <p className="w-1/6 text-left">{rippleData.rank}</p>
                    <h1 className={`w-2/6 text-left font-medium ${primaryTextColor}`}>XRP</h1>
                    <div className='flex gap-1 items-center w-2/6 justify-center'>
                        <p className='mb-1'>{rippleData.icon}</p>
                        <p className={` ${rippleData.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{rippleData.display}</p>
                    </div>
                    <p className="w-1/6 text-right">{rippleData.volume}</p>
                </div>

                {/* Binance Coin Row */}
                <div className={`flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 ${secondaryTextColor}`}>
                    <p className="w-1/6 text-left">{binancecoinData.rank}</p>
                    <h1 className={`w-2/6 text-left font-medium ${primaryTextColor}`}>BNB</h1>
                    <div className='flex gap-1 items-center w-2/6 justify-center'>
                        <p className='mb-1'>{binancecoinData.icon}</p>
                        <p className={` ${binancecoinData.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{binancecoinData.display}</p>
                    </div>
                    <p className="w-1/6 text-right">{binancecoinData.volume}</p>
                </div>

                {/* Solana Row */}
                <div className={`flex items-center justify-between py-2 ${secondaryTextColor}`}> 
                    <p className="w-1/6 text-left">{solanaData.rank}</p>
                    <h1 className={`w-2/6 text-left font-medium ${primaryTextColor}`}>SOL</h1>
                    <div className='flex gap-1 items-center w-2/6 justify-center'>
                        <p className='mb-1'>{solanaData.icon}</p>
                        <p className={` ${solanaData.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{solanaData.display}</p>
                    </div>
                    <p className="w-1/6 text-right">{solanaData.volume}</p>
                </div>
            </div>
        </div>
    )
}

export default CryptoOverview;