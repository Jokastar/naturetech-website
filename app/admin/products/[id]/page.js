"use client";
import React from 'react'; 
import ProductForm from '@/app/components/ProductForm';
import { useFormState } from 'react-dom';
import { updateProduct, getProductById } from '../_actions/products';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'



function EditProduct() {
  const {id} = useParams(); 
  const updateProductWithId = updateProduct.bind(null, id)

  const [errors, action] = useFormState(updateProductWithId)
  

  const [product, setProduct] = useState({});
  const [error, setError] = useState(null); 



  useEffect(()=>{
      const fetchProduct = async(id) =>{
         const product = await getProductById(id, true)
         if(!product){
          setError("product not found"); 
          return; 
        }
        setProduct(product);
      }

      fetchProduct(id); 
      
  }, [])

  if(error) return (<div>{error}</div>)

  return (
    <>
      <p>{error}</p>
      <ProductForm errors={errors} action={action} product={product} />
    </>
    
  )
}

export default EditProduct