"use client";

import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

const SalesChart = ({ chartData, label }) => {
  const labels = chartData.map(data => data.day);
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: chartData.map(data => data.total),
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
        ticks: {
          stepSize: 100
        }
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

