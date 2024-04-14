"use server";
import fs from "fs/promises"; 
import { notFound, redirect } from "next/navigation";
import Product from "../../../schemas/mongoSchema/Product"; 
import {productSchema} from "../../../schemas/zodSchema/productSchema"; 


export async function addNewProduct(prevState, formData){ 

    const formDataObj = Object.fromEntries(formData.entries())
    
    const result = await productSchema.safeParse(formDataObj); 

    if(!result.success){
      const formattedErrors = result.error.errors.map(error => ({
        message: error.message,
        path: error.path.join('.')
    }));
  
        return formattedErrors; 
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

      await newProduct.save(); 

  }catch(e){
    console.log(e); 
  }

  redirect("/admin/products"); 
  
}

export async function getProducts() {
  try {

    const products = await Product.find({}).lean(); // Fetch products from the database

    return products

  } catch (error) {
    console.error(error);
      return []; 
  }
}

export async function deleteProducts(id){
  const product = await Product.findOneAndDelete({_id:id}); 
  if(!product) return notFound();

  await fs.unlink(`public${product.imagePath}`);  

}

export async function updateProduct(prevState, formData){ 

  const formDataObj = Object.fromEntries(formData.entries())
  
  const result = await productSchema.safeParse(formDataObj); 

  if(!result.success){
    const formattedErrors = result.error.errors.map(error => ({
      message: error.message,
      path: error.path.join('.')
  }));

      return formattedErrors; 
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

    await newProduct.save(); 

}catch(e){
  console.log(e); 
}

redirect("/admin/products"); 

}

export async function toggleProductAvailability(id, isAvailable){
  const updatedProduct = await Product.findOneAndUpdate({_id:id}, {isAvailableForPurchase: isAvailable})

  if(!updatedProduct) return notFound(); 
}


