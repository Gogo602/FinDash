// src/components/stocks/StockChart.jsx
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
import 'chartjs-adapter-date-fns'; 

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const StockChart = ({ symbol = 'AAPL', days = 20 }) => { // Default to AAPL and 20 days
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false); // 
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effect to detect dark mode (re-used from previous components)
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

    // Function to generate simulated stock data
    const generateSimulatedData = useCallback(() => {
        const labels = [];
        const values = [];
        const basePrice = 170.00; 
        const volatility = 2.0;   

        // Current date (May 21, 2025) - remember the context
        const endDate = new Date(2025, 4, 21); // Month is 0-indexed (May is 4)

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(endDate);
            date.setDate(endDate.getDate() - i); 

            if (date.getDay() === 0 || date.getDay() === 6) { // Sunday or Saturday
                continue;
            }

            labels.push(date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }));

            // Simulate price movement
            let simulatedPrice = basePrice + (Math.random() - 0.5) * volatility * 2; // Basic random walk
            if (i > days / 2) { // Simulate a slight upward trend in the first half
                simulatedPrice += (days / 2 - i) * 0.5;
            } else { // Simulate a slight downward or flat trend in the second half
                simulatedPrice -= (i) * 0.2;
            }
            // Add some noise to make it less linear
            simulatedPrice += (Math.random() - 0.5) * (volatility / 2);

            // Ensure prices don't go negative (though unlikely for stocks)
            simulatedPrice = Math.max(10, simulatedPrice); // Min price of 10

            values.push(parseFloat(simulatedPrice.toFixed(2)));
        }

        // To ensure the chart goes from oldest to newest data
        labels.reverse();
        values.reverse();

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: `${symbol.toUpperCase()} Price`,
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
    }, [symbol, days]); // Dependencies for useCallback

    useEffect(() => {
        // No debounce needed as no API call
        generateSimulatedData();
    }, [generateSimulatedData]); // Dependency on the memoized function

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
                text: `${symbol.toUpperCase()} Price Performance (${days} Days)`,
                color: textColor,
                font: {
                    size: 18,
                    weight: 'bold',
                },
                align: 'start',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                titleColor: 'white',
                bodyColor: 'white',
                cornerRadius: 6,
                displayColors: false,
                padding: 10,
                callbacks: {
                    title: function(context) {
                        if (context.length > 0) {
                            return context[0].label;
                        }
                        return '';
                    },
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            x: {
                type: 'category', 
                grid: {
                    display: true,
                    drawBorder: false,
                    color: gridColor,
                    borderDash: [2, 2],
                },
                ticks: {
                    color: tickColor,
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0,
                },
            },
            y: {
                grid: {
                    display: true,
                    drawBorder: false,
                    color: gridColor,
                    borderDash: [2, 2],
                },
                ticks: {
                    color: tickColor,
                    callback: function(value) {
                        return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`; 
                    },
                    precision: 0, 
                },
            },
        },
    };

    if (loading) {
        return <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">Loading chart data...</div>;
    }

    if (error) {
        return <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 h-96 flex items-center justify-center text-red-500 dark:text-red-400">Error loading chart: {error}</div>;
    }

    if (!chartData) {
        return <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">No chart data to display for {symbol.toUpperCase()} in the last {days} days.</div>;
    }

    return (
        <div className='bg-white p-4 dark:bg-gray-800 shadow-md rounded-lg h-96'>
            <div style={{ height: '100%', width: '100%' }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default StockChart;