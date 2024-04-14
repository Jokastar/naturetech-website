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
   
 /* return (
    <form  className="w-[500px] p-3 flex flex-col justify-between items-center border border-slate-700 rounded-md" 
    action={action}>
                
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="name">Product Name</label>
        <input 
            className='py-2 px-1 border border-slate-600 rounded-md'
            type="text" 
            id="name" 
            name="name" 
            required 

        />
         {errors && getFormError(errors, "name")}
    </div>

    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="priceInCents">Price in Cents</label>
        <input
            className='py-2 px-1 border border-slate-600 rounded-md' 
            type="number" 
            id="priceInCents" 
            name="priceInCents" 
            required
        />
        {errors && getFormError(errors, "priceInCents")}
    </div>

    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="description">Description:</label>
        <textarea 
            className='py-2 px-1 border border-slate-600 rounded-md' 
            id="description" 
            name="description" 
            rows="4" 
            required
        />
        {errors && getFormError(errors, "description")}
    </div>

    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="image">Image</label>
        <input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*" 
            required
        />
        {errors && getFormError(errors, "image")}
    </div>

    <div>
        <SubmitButton/>
    </div>

</form>
  )*/
}


function SubmitButton(){
    const {pending} = useFormStatus(); 
    return(
        <button className='bg-black text-white w-[400px] mx-auto my-6 py-2 px-1 rounded-md' 
                type="submit"
                disabled={pending}
                >
                    {pending ? "Saving..." : "Save"}
        </button>

    )

}

export default NewProduct