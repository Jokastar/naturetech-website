
import React from 'react'
import getFormError from '@/app/lib/getFormError';
import {useFormStatus} from "react-dom";
import Image from 'next/image';

function ProductForm({product, action, errors}) {

  return (
    <form  className="w-[500px] p-3 flex flex-col justify-between items-center border border-slate-700 rounded-md" 
    action={action}>
                
    {/* Product Name */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="name">Name</label>
        <input 
            className='py-2 px-1 border border-slate-600 rounded-md'
            type="text" 
            id="name" 
            name="name" 
            required
            defaultValue={product?.name} 

        />
         {errors && getFormError(errors, "name"|| "")}
    </div>

    {/* Price in Cents */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="priceInCents">Price EUR</label>
        <input
            className='py-2 px-1 border border-slate-600 rounded-md' 
            type="number" 
            id="priceInCents" 
            name="priceInCents" 
            required
            defaultValue={product?.priceInCents}
        />
        {errors && getFormError(errors, "priceInCents" || "")}
    </div>

    {/* quantity */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="priceInCents">Quantity</label>
        <input
            className='py-2 px-1 border border-slate-600 rounded-md' 
            type="number" 
            id="quantity" 
            name="quantity" 
            required
            defaultValue={product?.quantity}
        />
        {errors && getFormError(errors, "quantity" || "")}
    </div>

    {/* Description */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="description">Description:</label>
        <textarea 
            className='py-2 px-1 border border-slate-600 rounded-md' 
            id="description" 
            name="description" 
            rows="4" 
            required
            defaultValue={product?.description || ""}
        />
        {errors && getFormError(errors, "description")}
    </div>

    {/* Image */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="image">Image</label>
        {product && <Image src={product.imagePath} height="400" width="600" alt={product.name}/>}
        {product && <div>{product.imagePath}</div>}
        <input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*" 
        />
        {errors && getFormError(errors, "image")}
    </div>
    <div>
        <SubmitButton/>
    </div>

</form>
  )
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

export default ProductForm