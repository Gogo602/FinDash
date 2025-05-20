import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

const StockPerformanceChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        // Register necessary Chart.js components
        Chart.register(...registerables);

        // Data for the chart
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Stock Performance',
                    data: [400, 300, 500, 800, 700, 900, 1000, 1100, 1200, 1400, 1600, 1500], // Example stock values
                    borderColor: 'rgba(54, 162, 235, 1)', // Blue color
                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue fill
                    fill: false, //  No fill
                    pointRadius: 0, // No point radius
                    tension: 0.4, // Add curve to the line
                },
            ],
        };

        // Chart options (customize as needed)
        const options = {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)', // Light gridlines for x-axis
                        borderDash: [2, 5],
                    },
                    ticks: {
                        color: '#666', // X-axis label color
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)', // Light gridlines for y-axis
                        borderDash: [2, 5],
                    },
                    ticks: {
                        color: '#666', // Y-axis label color
                    }
                },
            },
            plugins: {
                legend: {
                    display: false, // Remove legend
                },
                tooltip: {
                    backgroundColor: '#000', // Black tooltip background
                    titleColor: '#fff',       // White tooltip title
                    bodyColor: '#fff',       // White tooltip body
                    borderColor: '#000',     // Black tooltip border
                    borderWidth: 1,
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y); // Format as currency
                            }
                            return label;
                        },
                    },
                },
            },
        };

        // Create the chart
        const chartCtx = document.getElementById('stockChart');
        if (chartCtx && chartRef.current === null) {
            chartInstance.current = new Chart(chartCtx, {
                type: 'line',
                data: data,
                options: options,
            });
        }

        // Cleanup function to destroy the chart when the component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartRef.current = null;
            }
        };
    }, []);

    return (
        <div className="chart-container">
            <canvas id="stockChart" width="400" height="200"></canvas>
        </div>
    );
};

export default StockPerformanceChart;
