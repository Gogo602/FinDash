
import React, { useEffect, useState, useCallback } from 'react';
import Card from '../Card';
import { FaArrowUp, FaArrowDown, FaPlus, FaMinus } from 'react-icons/fa'; 
import CryptoChart from './CryptoChart';
import CryptoWatchlist from './CryptoWatchlist';
import CryptoOverview from './CryptoOverview';

const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY; 

const Crypto = () => {
    const [allCoins, setAllCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                throw new Error(`HTTP error! status: ${response.status}`);
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

        
        const displayValue = `${Math.abs(percentage).toFixed(2)}%`; // Use Math.abs to remove the minus sign for the number
        
        const type = percentage >= 0 ? <FaPlus className="inline w-2 ml-1 text-green-500" /> : <FaMinus className="inline w-2 ml-1 text-red-500" />;
        const icon = percentage >= 0 ? <FaArrowUp className="inline ml-1 text-green-500" /> : <FaArrowDown className="inline ml-1 text-red-500" />;

        return { display: displayValue, type: type, icon: icon };
    };

    const bitcoinChange = formatChange(bitcoin);
    const ethereumChange = formatChange(ethereum);
    const solanaChange = formatChange(solana);
    const tetherChange = formatChange(tether);

    return (
        <div className='w-full space-x-3'>
            <div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <Card
                        icon={bitcoin ? <img src={bitcoin.image} alt={`${bitcoin.name} logo`} className="w-5 h-5 rounded-full" /> : null}
                        title="Bitcoin"
                        value={bitcoin ? `$${bitcoin.current_price.toLocaleString()}` : 'N/A'}
                        change={bitcoinChange.display}
                        changeType={bitcoinChange.type}
                        changeIcon={bitcoinChange.icon}
                    />
                    <Card
                        icon={ethereum ? <img src={ethereum.image} alt={`${ethereum.name} logo`} className="w-5 h-5 rounded-full" /> : null}
                        title="Ethereum"
                        value={ethereum ? `$${ethereum.current_price.toLocaleString()}` : 'N/A'}
                        change={ethereumChange.display}
                        changeType={ethereumChange.type}
                        changeIcon={ethereumChange.icon}
                    />
                    <Card
                        icon={solana ? <img src={solana.image} alt={`${solana.name} logo`} className="w-5 h-5 rounded-full" /> : null}
                        title="Solana"
                        value={solana ? `$${solana.current_price.toLocaleString()}` : 'N/A'}
                        change={solanaChange.display}
                        changeType={solanaChange.type}
                        changeIcon={solanaChange.icon}
                    />
                    <Card
                        icon={tether ? <img src={tether.image} alt={`${tether.name} logo`} className="w-5 h-5 rounded-full" /> : null}
                        title="Tether (USDT)"
                        value={tether ? `$${tether.current_price.toLocaleString()}` : 'N/A'}
                        change={tetherChange.display}
                        changeType={tetherChange.type}
                        changeIcon={tetherChange.icon}
                    />
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6'>
                    <CryptoChart />
                    <CryptoWatchlist />
                </div>
                <div className=''>
                    <CryptoOverview />
                </div>
            </div>
        </div>
    );
};

export default Crypto;