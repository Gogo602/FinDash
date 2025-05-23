
import { useCallback, useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';


const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY; 

const CryptoWatchlist = () => {
    const [allCoins, setAllCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false); 
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
    const solana = allCoins.find(coin => coin.id === 'solana');
    const tether = allCoins.find(coin => coin.id === 'tether');
    const tron = allCoins.find(coin => coin.id === 'tron');

    if (loading) {
        return <div className="p-4 min-h-screen text-center text-gray-500 dark:text-gray-400">Loading crypto data...</div>;
    }

    if (error) {
        return <div className="p-4 min-h-screen text-center text-red-500 dark:text-red-400">Error: {error}</div>;
    }

    // Helper function to format change and include icon
    const formatChange = (coin) => {
        if (!coin || (coin.price_change_percentage_24h === undefined || coin.price_change_percentage_24h === null)) {
            return { display: 'N/A', type: 'neutral', icon: null };
        }

        const percentage = coin.price_change_percentage_24h;
        const displayValue = `${Math.abs(percentage).toFixed(2)}%`;

       
        const type = percentage >= 0 ? 'positive' : 'negative'; 
        const icon = percentage >= 0 ? <FaArrowUp className="inline w-2 ml-1 text-green-500" /> : <FaArrowDown className="inline w-2 ml-1 text-red-500" />;

        return { display: displayValue, type: type, icon: icon };
    };

    const bitcoinChange = formatChange(bitcoin);
    const ethereumChange = formatChange(ethereum);
    const solanaChange = formatChange(solana);
    const tetherChange = formatChange(tether);
    const tronChange = formatChange(tron);

    return (
        <div className='bg-white p-5 dark:bg-gray-800 shadow-md rounded-lg w-full'>
            {/* Dynamic text color for the title */}
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>My Crypto Watchlist</h3>
            
            <div className='space-y-4'>
                {/* Bitcoin */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-5'>
                        <p>{bitcoin ? <img src={bitcoin.image} alt={`${bitcoin.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                        <div>
                            <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>BTC</h1>
                            <h6 className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bitcoin</h6>
                        </div>
                    </div>
                    <div>
                        <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bitcoin ? `$${bitcoin.current_price.toLocaleString()}` : 'N/A'}</h1>
                        <div className='flex gap-1 items-center'>
                            <p className='mb-1'>{bitcoinChange.icon}</p>
                            <p className={`text-[9px] ${bitcoinChange.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{bitcoinChange.display}</p>
                        </div>
                    </div>
                </div>

                {/* Ethereum */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-5'>
                        <p>{ethereum ? <img src={ethereum.image} alt={`${ethereum.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                        <div className=''>
                            <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ETH</h1>
                            <h6 className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Ethereum</h6>
                        </div>
                    </div>
                    <div className='text-left'>
                        <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{ethereum ? `$${ethereum.current_price.toLocaleString()}` : 'N/A'}</h1>
                        <div className='flex items-center gap-1'>
                            <p className='mb-1'>{ethereumChange.icon}</p>
                            <p className={`text-[9px] ${ethereumChange.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{ethereumChange.display}</p>
                        </div>
                    </div>
                </div>

                {/* Solana */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-5'>
                        <p>{solana ? <img src={solana.image} alt={`${solana.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                        <div>
                            <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>SOL</h1>
                            <h6 className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Solana</h6>
                        </div>
                    </div>
                    <div>
                        <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{solana ? `$${solana.current_price.toLocaleString()}` : 'N/A'}</h1>
                        <div className='flex items-center gap-1'>
                            <p className='mb-1'>{solanaChange.icon}</p>
                            <p className={`text-[9px] ${solanaChange.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{solanaChange.display}</p>
                        </div>
                    </div>
                </div>

                {/* Tether */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-5'>
                        <p>{tether ? <img src={tether.image} alt={`${tether.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                        <div>
                            <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>USDT</h1>
                            <h6 className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tether</h6>
                        </div>
                    </div>
                    <div>
                        <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tether ? `$${tether.current_price.toLocaleString()}` : 'N/A'}</h1>
                        <div className='flex items-center gap-1'>
                            <p className='mb-1'>{tetherChange.icon}</p>
                            <p className={`text-[9px] ${tetherChange.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{tetherChange.display}</p>
                        </div>
                    </div>
                </div>

                {/* Tron */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-5'>
                        <p>{tron ? <img src={tron.image} alt={`${tron.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                        <div>
                            <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>TRX</h1>
                            <h6 className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tron</h6>
                        </div>
                    </div>
                    <div>
                        <h1 className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{tron ? `$${tron.current_price.toLocaleString()}` : 'N/A'}</h1>
                        <div className='flex items-center gap-1'>
                            <p className='mb-1'>{tronChange.icon}</p>
                            <p className={`text-[9px] ${tronChange.type === 'positive' ? 'text-green-500' : 'text-red-500'}`}>{tronChange.display}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CryptoWatchlist;