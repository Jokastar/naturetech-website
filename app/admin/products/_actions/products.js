"use server";
import fs from "fs/promises"; 
import { notFound, redirect } from "next/navigation";
import Product from "../../../schemas/mongoSchema/Product"; 
import Order from "@/app/schemas/mongoSchema/Order";
import mongoose from "mongoose";

import dbConnect from "../../../lib/db"; 

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

    let products = await Product.find({}); // Fetch products from the database

    return products

  } catch (error) {
    console.error(error);
      return []; 
  }
}

export async function getProductById(id){
  const product = await Product.findOne({_id:id}).lean(); 

  return product; 
}

export async function deleteProducts(id){
  const product = await Product.findOneAndDelete({_id:id}); 
  if(!product) return notFound();

  await fs.unlink(`public${product.imagePath}`);  

}

export async function updateProduct(id, prevState, formData){ 
  const formDataObj = Object.fromEntries(formData.entries());
  
  const result = await productSchema.safeParse(formDataObj); 

  if(!result.success){
    const formattedErrors = result.error.errors.map(error => ({
      message: error.message,
      path: error.path.join('.')
    }));

    return formattedErrors; 
  }
  
  const data = result.data; 

  // Check if there's an image in the form data
  if (data.image) {
    // Create a new directory for products if it doesn't exist
    await fs.mkdir("public/products", { recursive: true }); 

    // Generate a unique image path
    const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;


    // Write the image file to the public directory
    await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

    // Update the imagePath in the data
    data.imagePath = imagePath;
  }

  try {
    // Find the existing product by ID
    const existingProduct = await Product.findById(id).lean();

    if (!existingProduct) {
      return notFound(); 
    }

    // Construct the path to the existing image
    const existingImagePath = `public${existingProduct.imagePath}`;

    // Check if the file exists before attempting to delete it
    try {
      await fs.unlink(existingImagePath);
    } catch (error) {
      console.log(`Failed to remove existing image: ${error}`);
    }

    // Update the existing product fields with the new data
    existingProduct.name = data.name;
    existingProduct.description = data.description;
    existingProduct.priceInCents = data.priceInCents;

    if (data.imagePath) {
      existingProduct.imagePath = data.imagePath;
    }

    // Save the updated product
    await existingProduct.save(); 

  } catch(e) {
    console.log(e); 
    throw e;  // Re-throw the error to handle it in the calling function
  }

  // Redirect after successful update
  redirect("/admin/products"); 
}


export async function toggleProductAvailability(id, isAvailable){
  const updatedProduct = await Product.findOneAndUpdate({_id:id}, {isAvailableForPurchase: !isAvailable})

  if(!updatedProduct) return notFound(); 
}

export async function getNoOfOrderByProduct(productId){
  const ObjectId = mongoose.Types.ObjectId;
    
  try {
      const result = await Order.aggregate([
          {
              $unwind: "$productIds"
          },
          {
              $match: {
                  "productIds": new ObjectId(productId)
              }
          },
          {
              $group: {
                  _id: "$productIds",
                  count: { $sum: 1 }
              }
          }
      ]);
      
      if(result.length > 0) {
          const productOrderCount = result[0].count;
          return productOrderCount
      } else {
          return 0; 
      }
  } catch (err) {
      console.error(err);
  }
  

}


