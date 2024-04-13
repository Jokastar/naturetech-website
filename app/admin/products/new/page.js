

import React from 'react'
import { addNewProduct } from '../_actions/products';


function NewProduct() {
  return (
    <form  className="w-[500px] p-3 flex flex-col justify-between items-center border border-slate-700 rounded-md" action={addNewProduct} encType="multipart/form-data">
                
    {/* Product Name */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="name">Product Name</label>
        <input 
            className='py-2 px-1 border border-slate-600 rounded-md'
            type="text" 
            id="name" 
            name="name" 
            required 

        />
    </div>

    {/* Price in Cents */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="priceInCents">Price in Cents</label>
        <input
            className='py-2 px-1 border border-slate-600 rounded-md' 
            type="number" 
            id="priceInCents" 
            name="priceInCents" 
            required 
        />
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
        />
    </div>

    {/* Image */}
    <div className='w-full flex flex-col gap-2'>
        <label htmlFor="image">Image</label>
        <input 
            type="file" 
            id="image" 
            name="image" 
            accept="image/*" 
            required 
        />
    </div>

    {/* Submit Button */}
    <div>
        <button className='bg-black text-white w-[400px] mx-auto my-6 py-2 px-1 rounded-md' type="submit">Submit</button>
    </div>

</form>
  )
}

export default NewProduct