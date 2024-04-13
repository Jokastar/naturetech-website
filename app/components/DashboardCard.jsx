import React from 'react'

function DashboardCard({title, subtitle, body}) {
  return (
    <div className="card w-96 bg-primary text-primary-content">
  <div className="card-body">
    <h2 className="card-title">{title}</h2>
    <p>{subtitle}</p>
    <div className="card-actions justify-end">
      <p>{body}</p>
    </div>
  </div>
</div>
  )
}

export default DashboardCard