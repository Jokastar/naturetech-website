"use client"; 

import Image from 'next/image'
import ProductDropDown from './ProductDropDown'
import { getNoOfOrderByProduct } from '../admin/products/_actions/products';
import {useState, useEffect} from "react"

 function ProductTableRow({name, price, imagePath, productId, isAvailable}) { 
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
      <tr>
        <th>{isAvailable.toString()}</th>
        <td>
          <div className='w-[80px] h-[80px]'>
            <Image src={imagePath} alt={name} width={80} height={80}
        className="rounded-md"/>
          </div>
        </td>
        <td>{name}</td>
        <td>{price}</td>
        <td>{noOfOrder}</td>
        <td><ProductDropDown productId={productId} isAvailable={isAvailable}/></td>
      </tr>
  )
}

export default ProductTableRow