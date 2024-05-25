
import React from 'react'
import { getTotalSales, getSalesFromLast7Days, getOrderCountFromLast7Days, getTotalOrders, getAverageOrderValue, getAverageOrderValueFromLas7Days } from './products/_actions/products';
import DashboardCard from '../components/DashboardCard';

async function AdminDashboard() {
   const totalSales = await getTotalSales();
   const salesFromLast7days = await getSalesFromLast7Days(); 
   const totalOrders = await getTotalOrders(); 
   const ordersCountFromLast7Days = await getOrderCountFromLast7Days(); 
   const {averageSpent} = await getAverageOrderValue(); 
   const averageOrderValueFromLast7Days = await getAverageOrderValueFromLas7Days(); 

  return (
    <main>
        <div className='grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <DashboardCard title ={"Total sales"} subtitle={`$${totalSales.totalSalesInDollars}`} data={salesFromLast7days} label={"Total sales"}/>
            <DashboardCard title ={"Total orders"} subtitle={totalOrders} label={"Total orders"} data={ordersCountFromLast7Days}/>
            <DashboardCard title ={"Average order value"} subtitle={averageSpent} label={"Average order value"} data={averageOrderValueFromLast7Days}/>
        </div>
    </main>
  )
}

export default AdminDashboard