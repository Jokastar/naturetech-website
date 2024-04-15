"use client"; 

import React from 'react'
import { addNewProduct } from '../_actions/products';
import { useFormState} from "react-dom";
import ProductForm from '@/app/components/ProductForm';



function NewProduct() {
    const [errors, action] = useFormState(addNewProduct, {});  

    return(
        <ProductForm errors={errors} action={action}/>
    )
}


export default NewProduct