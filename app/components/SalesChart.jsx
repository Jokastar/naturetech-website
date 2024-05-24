"use client";

import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

const SalesChart = ({ chartData }) => {
  const labels = chartData.map(sale => sale.day);
  console.log(labels);
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Total Sales',
        data: chartData.map(sale => sale.totalSales),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: 'category',
        ticks: {
          callback: function(value) {
            return labels[value];
          },
        },
        grid: {
          display: false,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    }
  };

  return (
    <div>
      <div className='w-[300px] h-[160px]'>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;

