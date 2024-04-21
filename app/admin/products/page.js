

import React from 'react'
import ProductTableRow from '@/app/components/ProductTableRow'; 
import { getProducts } from './_actions/products';

import Link from 'next/link'

  async function Products() {
    const products = await getProducts(true)
    if(products.lenght < 1) return ( <div>No products in the database</div>)
    

  return (
<>
<div className='flex justify-end'>
<Link href="/admin/products/new"><button className="btn btn-neutral">+ Add new Product</button></Link>
</div>
<div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>Availability</th>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Orders</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {products.map(p =>(
        <ProductTableRow 
        name={p.name} 
        price={p.priceInCents} 
        description={p.description} 
        imagePath={p.imagePath} 
        key={p._id} 
        productId={p._id}
        isAvailable={p.isAvailableForPurchase}
        />
      ))}
    </tbody>
  </table>
</div>
</>
  )
}


export default Products