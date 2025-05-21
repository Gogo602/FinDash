// components/CryptoChart.js
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
  TimeScale, // Import TimeScale for more robust date handling (optional, but good for charts)
} from 'chart.js';
import 'chartjs-adapter-date-fns'; // Required for TimeScale

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  // If using TimeScale, uncomment these and make sure adapter is installed
  // TimeScale // You might need to install 'date-fns' or 'moment' and their chart.js adapters
);

const COINGECKO_API_KEY = 'CG-t1v39nhdWBNciCQEnkYDnR2K'; // Your actual API key

const CryptoChart = ({ coinId = 'bitcoin', days = 7, currency = 'usd' }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMarketChartData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setChartData(null); // Clear previous data

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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.prices) {
        const prices = data.prices;
        
        // Dynamically format labels based on the number of days
        const labels = prices.map(price => {
          const date = new Date(price[0]);
          if (days <= 1) { // Within 24 hours, show time
            return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
          } else if (days <= 30) { // Up to 30 days, show short date
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          } else { // More than 30 days, show month/year
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
              backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
              borderColor: 'rgba(54, 162, 235, 1)',    // Solid blue line
              tension: 0.3, // Apply some tension for a smoother curve
              pointRadius: 0, // Hide data points
              pointHoverRadius: 5, // Show point on hover
              hitRadius: 10, // Larger hit area for tooltips
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Image doesn't show legend
      },
      title: {
        display: true,
        text: `${coinId.charAt(0).toUpperCase() + coinId.slice(1)} Performance`,
        color: 'black', // Dark text for the title
        font: {
          size: 18, // Slightly larger title
          weight: 'bold',
        },
        align: 'start', // Align title to the left
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(30, 41, 59, 0.9)', // Dark background (like slate-800)
        titleColor: 'white',
        bodyColor: 'white',
        cornerRadius: 6, // Rounded corners
        displayColors: false, // Hide the colored box next to the label
        padding: 10,
        callbacks: {
            title: function(context) {
                // Get the date label from the context
                if (context.length > 0) {
                    const label = context[0].label;
                    return label; // The label is already formatted
                }
                return '';
            },
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += `$${context.parsed.y.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                }
                return `value : ${label}`; // "value : $XXXX.XX"
            }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
          drawBorder: false, // Hide axis line
          color: (context) => context.tick && context.tick.major ? 'rgba(128, 128, 128, 0.3)' : 'rgba(128, 128, 128, 0.1)', // Thicker for major ticks, thinner for minor
          borderDash: [2, 2], // Dotted lines
        },
        ticks: {
          color: 'gray', // Axis label color
          autoSkip: true, // Automatically skip labels if too crowded
          maxRotation: 0, // Prevent labels from rotating
          minRotation: 0,
        },
      },
      y: {
        grid: {
          display: true,
          drawBorder: false, // Hide axis line
          color: (context) => context.tick && context.tick.major ? 'rgba(128, 128, 128, 0.3)' : 'rgba(128, 128, 128, 0.1)',
          borderDash: [2, 2], // Dotted lines
        },
        ticks: {
          color: 'gray',
          callback: function(value) {
            return `$${value.toLocaleString()}`; // Format Y-axis labels as currency
          },
          precision: 0, // No decimal places for Y-axis ticks
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
    <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg h-96'> {/* Added fixed height for container */}
      <h3 className='text-lg font-semibold mb-2 text-gray-900 dark:text-white sr-only'>Crypto Performance</h3> {/* Hidden, as title is part of chart */}
      <div style={{ height: '100%', width: '100%' }}> {/* Chart fills the container */}
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default CryptoChart;