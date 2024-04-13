"use client"; 

import React from 'react'
import ProductTableRow from '@/app/components/ProductTableRow'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function Products() {
  const pathname = usePathname(); 
  return (
<>
<div className='flex justify-end'>
<Link href={pathname + "/new"}><button className="btn btn-neutral">+ Add new Product</button></Link>
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
     <ProductTableRow name="product one" price="20£" orders={10}/>
     <ProductTableRow name="product two" price="20£" orders={10}/>
     <ProductTableRow name="product three" price="20£" orders={10}/>
    </tbody>
  </table>
</div>
</>
  )
}

export default Products