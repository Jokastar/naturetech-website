import React from 'react'
import SalesChart from './SalesChart'

function DashboardCard({title, subtitle, data, label}) {
  return (
    <div className="card max-w-96 bg-gray-200 rounded-lg">
  <div className="card-body">
    <h2 className="card-title">{title}</h2>
    <p>{subtitle}</p>
    <div>
      <SalesChart chartData={data} label={label}/>
    </div>
  </div>
</div>
  )
}

export default DashboardCard