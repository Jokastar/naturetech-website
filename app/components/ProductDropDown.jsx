import React from 'react'
import ProductDropDownBtn from './ProductDropDownBtn'
import Link from 'next/link'

function ProductDropDown({productId}) {
  return (
<div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn m-1">...</div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link href={"/admin/products/" + productId}>Edit</Link></li>
            <ProductDropDownBtn value="Delete" productId={productId}/>
        </ul>
</div>
  )
}

export default ProductDropDown