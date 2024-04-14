"use client"; 

import Image from 'next/image'
import ProductDropDown from './ProductDropDown'
import { getNoOfOrderByProduct } from '../admin/products/_actions/products';
import {useState, useEffect} from "react"

 function ProductTableRow({name, price, orders, imagePath, productId}) { 
  const [noOfOrder, setNoOfOrder] = useState(0);

  useEffect(() => {
    // Fetch the number of orders for the product
    async function fetchNoOfOrders() {
      const count = await getNoOfOrderByProduct(productId);
      setNoOfOrder(count);
    }

    fetchNoOfOrders();
  }, [productId]);

  
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
        <td>{noOfOrder}</td>
        <td><ProductDropDown productId={productId}/></td>
      </tr>
  )
}

export default ProductTableRow