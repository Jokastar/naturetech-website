import React from 'react'
import DashboardCard from '../components/DashboardCard'
import Order from '../schemas/mongoSchema/Order';
import Product from "../schemas/mongoSchema/Product"
import formatAmountInCents from '../lib/formatAmountInCents';

async function getSalesData() {
    try {
        const salesInfo = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSalesInCents: { $sum: "$pricePaidInCents" },
                    numberOfSales: { $sum: 1 } // Count the number of documents
                }
            }
        ]);

        // Extract total sales amount and number of sales from aggregation result
        const totalSalesInCents = salesInfo.length > 0 ? salesInfo[0].totalSalesInCents : 0;
        const numberOfSales = salesInfo.length > 0 ? salesInfo[0].numberOfSales : 0;

        // Convert total sales amount to dollars
        const totalSalesInDollars = totalSalesInCents / 100;

        return { totalSalesInDollars, numberOfSales };
    } catch (error) {
        console.error("Error calculating total sales and number of sales:", error);
        throw error;
    }
}

async function getUsersData() {
    try {
        const usersSpendInfo = await Order.aggregate([
            {
                $group: {
                    _id: '$userId', // Group by userId
                    totalSpendInCents: { $sum: '$pricePaidInCents' }, // Calculate total spend
                    numberOfOrders: { $sum: 1 } // Count number of orders
                }
            },
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 }, // Count number of users
                    totalSpendInCents: { $sum: '$totalSpendInCents' }, // Calculate total spend across all users
                    totalOrders: { $sum: '$numberOfOrders' } // Count total number of orders
                }
            }
        ]);

        // Calculate average spend per user
        const averageSpendInCents = usersSpendInfo.length > 0 ? usersSpendInfo[0].totalSpendInCents / usersSpendInfo[0].totalOrders : 0;

        return {
            totalUsers: usersSpendInfo.length > 0 ? usersSpendInfo[0].totalUsers : 0,
            averageSpent: averageSpendInCents / 100 // Convert average spend to dollars
        };
    } catch (error) {
        console.error("Error calculating users average spend:", error);
        throw error;
    }
}

async function getProductsData() {
    try {
        const productCounts = await Product.aggregate([
            {
                $group: {
                    _id: '$isAvailableForPurchase',
                    count: { $sum: 1 }
                }
            }
        ]);

        let availableCount = 0;
        let nonAvailableCount = 0;

        productCounts.forEach(count => {
            if (count._id === true) {
                availableCount = count.count;
            } else {
                nonAvailableCount = count.count;
            }
        });

        return {
            availableCount: availableCount,
            nonAvailableCount: nonAvailableCount
        };
    } catch (error) {
        console.error("Error counting available products:", error);
        throw error;
    }
}



async function AdminDashboard() {
    const salesData = await getSalesData();
    const usersData = await getUsersData();  
    const productData = await getProductsData(); 
  return (
    <main>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <DashboardCard title="Total sales" subtitle="test" body={formatAmountInCents(salesData.totalSalesInDollars)}/>
            <DashboardCard title="Number of sales" subtitle="test" body={salesData.numberOfSales}/>
            <DashboardCard title="Number of users" subtitle="test" body={usersData.totalUsers}/>
            <DashboardCard title="Average spent by user" subtitle="test" body={usersData.averageSpent}/>
            <DashboardCard title="Products" subtitle={"available: " + productData.availableCount} body={"non available: " + productData.nonAvailableCount}/>
        </div>
    </main>
  )
}

export default AdminDashboard