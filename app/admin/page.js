
import React from 'react'
import SalesChart from '../components/SalesChart';
import { getTotalSales, getSalesByDay } from './products/_actions/products';
import DashboardCard from '../components/DashboardCard';

async function AdminDashboard() {
   const totalSales = await getTotalSales();
   const salesByDay = await getSalesByDay(); 
   console.log(totalSales, salesByDay)
  return (
    <main>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
            <DashboardCard title ={"Total Sales"} subtitle={totalSales.totalSalesInDollars} data={salesByDay}/>
        </div>
    </main>
  )
}

export default AdminDashboard