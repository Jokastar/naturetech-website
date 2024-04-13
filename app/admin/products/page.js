

import React from 'react'
import ProductTableRow from '@/app/components/ProductTableRow'
import Product from "../../schemas/mongoSchema/Product"; 

import Link from 'next/link'

 function Products() {
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
        <th>Name</th>
        <th>Price</th>
        <th>Orders</th>
      </tr>
    </thead>
    <tbody>
      <ProductTableRow name="name"price={250} orders={10}/>
    </tbody>
  </table>
</div>
</>
  )
}

export default Products