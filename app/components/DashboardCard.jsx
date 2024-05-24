import React from 'react'
import SalesChart from './SalesChart'

function DashboardCard({title, subtitle, data}) {
  return (
    <div className="card w-96 bg-gray-200 rounded-lg">
  <div className="card-body">
    <h2 className="card-title">{title}</h2>
    <p>{subtitle}</p>
    <div>
      <SalesChart chartData={data}/>
    </div>
  </div>
</div>
  )
}

export default DashboardCard