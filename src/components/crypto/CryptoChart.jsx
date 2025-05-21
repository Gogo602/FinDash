import React, { useEffect, useState, useCallback } from 'react';
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

const COINGECKO_API_KEY = 'CG-t1v39nhdWBNciCQEnkYDnR2K';

const CryptoChart = ({ coinId = 'bitcoin', days = 7, currency = 'usd' }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // State to track dark mode

  // Effect to detect dark mode
  useEffect(() => {
    const detectDarkMode = () => {
      // Check if the HTML element has the 'dark' class
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // Initial detection
    detectDarkMode();

    // Observe changes to the HTML element's class attribute
    // This is useful if the theme can be toggled without a full page reload
    const observer = new MutationObserver(detectDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const fetchMarketChartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setChartData(null);

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': COINGECKO_API_KEY
      }
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`,
        options
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorData.error || errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();

      if (data && data.prices) {
        const prices = data.prices;
        
        const labels = prices.map(price => {
          const date = new Date(price[0]);
          if (days <= 1) {
            return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
          } else if (days <= 30) {
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          } else {
            return date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
          }
        });
        
        const values = prices.map(price => price[1]);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Price`,
              data: values,
              fill: true,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 5,
              hitRadius: 10,
            },
          ],
        });
      } else {
        setError("No price data available for this coin and period.");
      }
    } catch (err) {
      console.error("Failed to fetch market chart data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coinId, days, currency]);

  useEffect(() => {
    fetchMarketChartData();
  }, [fetchMarketChartData]);

  // Determine colors based on theme
  const textColor = isDarkMode ? 'white' : 'black';
  const gridColor = isDarkMode ? 'rgba(200, 200, 200, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tickColor = isDarkMode ? 'gray' : 'black';


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Performance`,
        color: textColor, // Dynamic color for title
        font: {
          size: 18,
          weight: 'bold',
        },
        align: 'start',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(0, 0, 0, 0.7)', // Darker tooltip on dark mode
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 6,
        displayColors: false,
        padding: 10,
        callbacks: {
            title: function(context) {
                if (context.length > 0) {
                    const label = context[0].label;
                    return label;
                }
                return '';
            },
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += '';
                }
                if (context.parsed.y !== null) {
                    label += `$${context.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                }
                return `value : ${label}`;
            }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false,
          color: gridColor, // Dynamic grid color
          borderDash: [2, 2],
        },
        ticks: {
          color: tickColor, // Dynamic tick color
          autoSkip: true,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: false,
          color: gridColor, // Dynamic grid color
          borderDash: [2, 2],
        },
        ticks: {
          color: tickColor, // Dynamic tick color
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          },
          precision: 0,
        },
      },
    },
  };

  if (loading) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading chart data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500 dark:text-red-400">Error loading chart: {error}</div>;
  }

  if (!chartData) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">No chart data to display.</div>;
  }

  return (
    <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg h-96'>
      {/* The actual h3 is effectively replaced by the chart's title */}
      <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white sr-only'>Crypto Performance</h3>
      <div style={{ height: '100%', width: '100%' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CryptoChart;