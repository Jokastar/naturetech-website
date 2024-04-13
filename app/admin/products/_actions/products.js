"use server";
import fs from "fs/promises"; 
import { redirect } from "next/navigation";
import Product from "../../../schemas/mongoSchema/Product"; 
import {productSchema} from "../../../schemas/zodSchema/productSchema"; 


export async function addNewProduct(formData){ 

    const formDataObj = Object.fromEntries(formData.entries())
    
    const result = await productSchema.safeParse(formDataObj); 

    if(!result.success){
        return result.error.formErrors.fieldsErrors; 
    }
 
    
    const data = result.data; 

    //it may recreae a new directory each call 
    await fs.mkdir("public/products", {recursive:true}); 
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));
    
  try{

    const newProduct =  await new Product({
        name:data.name,
        description:data.description,
        priceInCents:data.priceInCents,
        imagePath: imagePath
    })

    const savedProduct = await newProduct.save(); 

  }catch(e){
    console.log(e); 
  }

  redirect("/admin/products"); 
  
}
