"use client"; 

import Image from 'next/image'
import ProductDropDown from './ProductDropDown'
function ProductTableRow({name, price, orders, imagePath, productId}) {
  return (
      <tr className="hover">
        <th>
          <div className='w-[80px] h-[80px]'>
            <Image src={imagePath} alt={name} width={80} height={80}
        className="rounded-md"/>
          </div>
        </th>
        <td>{name}</td>
        <td>{price}</td>
        <td>{orders}</td>
        <td><ProductDropDown productId={productId}/></td>
      </tr>
  )
}

export default ProductTableRow