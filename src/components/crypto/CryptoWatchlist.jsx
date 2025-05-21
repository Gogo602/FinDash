import React, { useCallback, useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaMinus, FaPlus } from 'react-icons/fa';


const COINGECKO_API_KEY = 'CG-t1v39nhdWBNciCQEnkYDnR2K'; 
const CryptoWatchlist = () => {
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
    
            
            const displayValue = `${Math.abs(percentage).toFixed(2)}%`; // Use Math.abs to remove the minus sign for the number
            
            const type = percentage >= 0 ? <FaPlus className="inline w-1.5 ml-1 text-green-500" /> : <FaMinus className="inline w-1 ml-1 text-red-500" />;
            const icon = percentage >= 0 ? <FaArrowUp className="inline ml-1 text-green-500" /> : <FaArrowDown className="inline ml-1 text-red-500" />;
    
            return { display: displayValue, type: type, icon: icon };
        };
    
        const bitcoinChange = formatChange(bitcoin);
        const ethereumChange = formatChange(ethereum);
        const solanaChange = formatChange(solana);
        const tetherChange = formatChange(tether);
        const tronChange = formatChange(tron);
    
  return (
    <div className='bg-white p-6 dark:bg-gray-800 shadow-md rounded-lg w-full'>
        <h3 className='text-lg font-semibold mb-2'>My Crypto Watchlist</h3>
        <p className="text-center text-gray-500">Crypto watchlist goes here.</p>
          
      <div className='space-y-3'>
      <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    <p>{bitcoin ? <img src={bitcoin.image} alt={`${bitcoin.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                    <div>
                      <h1 className='text-sm'>BTC</h1>
                      <h6 className='text-[10px]'>Bitcoin</h6>
                    </div>
                </div>
                <div>
                    <h1 className='text-sm'>{bitcoin ? `$${bitcoin.current_price.toLocaleString()}` : 'N/A'}</h1>
                    <div className='flex items-center'>
                      <p>{bitcoinChange.icon}</p>
                      <p>{bitcoinChange.type}</p>
                    <p className='text-[9px]'>{bitcoinChange.display}</p>
                    </div>
                </div>
          </div>
          
          <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    <p>{ethereum ? <img src={ethereum.image} alt={`${ethereum.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                    <div>
                      <h1 className='text-sm'>ETH</h1>
                      <h6 className='text-[10px]'>Ethereum</h6>
                    </div>
                </div>
                <div>
                    <h1 className='text-sm'>{ethereum ? `$${ethereum.current_price.toLocaleString()}` : 'N/A'}</h1>
                    <div className='flex items-center'>
                      <p>{ethereumChange.icon}</p>
                      <p>{ethereumChange.type}</p>
                    <p className='text-[9px]'>{ethereumChange.display}</p>
                    </div>
                </div>
          </div>
          
          <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    <p>{solana ? <img src={solana.image} alt={`${solana.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                    <div>
                      <h1 className='text-sm'>SOL</h1>
                      <h6 className='text-[10px]'>Solana</h6>
                    </div>
                </div>
                <div>
                    <h1 className='text-sm'>{solana ? `$${solana.current_price.toLocaleString()}` : 'N/A'}</h1>
                    <div className='flex items-center'>
                      <p>{solanaChange.icon}</p>
                      <p>{solanaChange.type}</p>
                    <p className='text-[9px]'>{solanaChange.display}</p>
                    </div>
                </div>
          </div>
          
          <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    <p>{tether ? <img src={tether.image} alt={`${tether.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                    <div>
                      <h1 className='text-sm'>USDT</h1>
                      <h6 className='text-[10px]'>Tether</h6>
                    </div>
                </div>
                <div>
                    <h1 className='text-sm'>{tether ? `$${tether.current_price.toLocaleString()}` : 'N/A'}</h1>
                    <div className='flex items-center'>
                      <p>{tetherChange.icon}</p>
                      <p>{tetherChange.type}</p>
                    <p className='text-[9px]'>{tetherChange.display}</p>
                    </div>
                </div>
          </div>
          
          <div className='flex items-center justify-between'>
                <div className='flex items-center gap-5'>
                    <p>{tron ? <img src={tron.image} alt={`${tron.name} logo`} className="w-5 h-5 rounded-full" /> : null}</p>
                    <div>
                      <h1 className='text-sm'>TRX</h1>
                      <h6 className='text-[10px]'>Tron</h6>
                    </div>
                </div>
                <div>
                    <h1 className='text-sm'>{tron ? `$${tron.current_price.toLocaleString()}` : 'N/A'}</h1>
                    <div className='flex items-center'>
                      <p>{tronChange.icon}</p>
                      <p>{tronChange.type}</p>
                      <p className='text-[9px]'>{tronChange.display}</p>
                    </div>
                </div>
          </div>
      </div>    
    </div>
  )
}

export default CryptoWatchlist