"use server";
import fs from "fs/promises"; 
import { notFound, redirect } from "next/navigation";
import Product from "../../../schemas/mongoSchema/Product"; 
import Order from "@/app/schemas/mongoSchema/Order";
import Inventory from "@/app/schemas/mongoSchema/Inventory"; 
import mongoose from "mongoose";
import dbConnect from "../../../lib/db"; 
import {productSchema} from "../../../schemas/zodSchema/productSchema"; 

export async function addNewProduct(prevState, formData) {
  await dbConnect();
  const formDataObj = Object.fromEntries(formData.entries());

  const result = await productSchema.safeParse(formDataObj);

  if (!result.success) {
    const formattedErrors = result.error.flatten().fieldErrors;
    return formattedErrors;
  }

  const data = result.data;

  // Create a new directory if it doesn't exist
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(`public${imagePath}`, Buffer.from(await data.image.arrayBuffer()));

  try {
    // Save product details to the Product collection
    const newProduct = new Product({
      name: data.name,
      description: data.description,
      imagePath: imagePath
    });

    await newProduct.save();

    // Save product details to the Inventory collection
    const newInventoryItem = new Inventory({
      productId: newProduct._id, // Reference to the newly created Product
      priceInCents: data.priceInCents, // Price in cents from formData
      quantity: data.quantity // Quantity from formData
    });

    await newInventoryItem.save();

  } catch (e) {
    console.log(e);
    return;
  }

  // Redirect after successful addition
  redirect("/admin/products");
}

export async function getProducts(isAdmin = false) {
  await dbConnect();
  try {
    let products = await Product.find({}); // Fetch products from the Product collection
    let inventory = await Inventory.find({}); 

    // Map through each product to enrich it with inventory price and quantity
    const enrichedProducts = products.map(product => {
      let productId = product._id.toString(); 
      
      // Find the corresponding inventory item
      const inventoryItem = inventory.find(item => item.productId.toString() === productId);
      
      // If inventory item is found and it's an admin request, enrich the product
      if (inventoryItem && isAdmin) {
        return {
          ...product.toObject(),
          priceInCents: inventoryItem.priceInCents,
          quantity: inventoryItem.quantity,
          _id: productId
        };
      }

      // If no inventory item is found or it's not an admin request, return the product as is
      return {
        ...product.toObject(),
        priceInCents: !isAdmin && inventoryItem ? inventoryItem.priceInCents : 0,
        _id: productId
      };
    });

    return enrichedProducts; 

  } catch (error) {
    console.log(error);
    return []; 
  }
}

export async function getAvailableProducts() {
  await dbConnect();

  try {
    // Query to find products that are available for purchase
    const availableProducts = await Product.find({ isAvailableForPurchase: true }).exec();
    return availableProducts;
  } catch (error) {
    console.error('Error fetching available products:', error);
    throw error;
  }
}

export async function updateProduct(id, prevState, formData) {
  await dbConnect();
  const formDataObj = Object.fromEntries(formData.entries());

  const result = await productSchema.safeParse(formDataObj);

  if (!result.success) {
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
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return notFound();
    }

    // Construct the path to the existing image file
    const existingImagePath = `public${existingProduct.imagePath}`;

    // Check if the image file exists before attempting to delete it
    try {
      if (existingProduct.imagePath) {
        await fs.unlink(existingImagePath);
      }
    } catch (error) {
      console.log(`Failed to remove existing image: ${error}`);
    }

    // Update the existing product fields with the new data
    existingProduct.name = data.name;
    existingProduct.description = data.description;

    if (data.imagePath) {
      existingProduct.imagePath = data.imagePath;
    }

    // Find the associated inventory item
    const inventoryItem = await Inventory.findOne({ productId: id });

    if (!inventoryItem) {
      return notFound();
    }

    // Update the inventory fields
    inventoryItem.priceInCents = data.priceInCents;
    inventoryItem.quantity = data.quantity;

    // Save the updated product and inventory item
    await existingProduct.save();
    await inventoryItem.save();

  } catch (e) {
    console.log(e);
    throw e;  // Re-throw the error to handle it in the calling function
  }

  // Redirect after successful update
  redirect("/admin/products");
}

export async function getProductById(id, isAdmin = false){
  await dbConnect()
  try {
    const product = await Product.findOne({_id:id}).lean();
  
    if (!product) {
      // Handle product not found
      return notFound();
    }

    const productInventory = await Inventory.findOne({productId: product._id});

    if (productInventory && isAdmin) {
      product.priceInCents = productInventory.priceInCents; 
      product.quantity = productInventory.quantity;  
    } else {
      // Handle if there's no inventory item found for the product or it's not an admin request
      product.priceInCents = productInventory && productInventory.priceInCents;
    }

    return product; 

  } catch(e) {
    console.log(e); 
  }
}


export async function deleteProducts(id) {
  await dbConnect();
  
  // Find and delete the product by ID
  const product = await Product.findOneAndDelete({ _id: id });
  if (!product) return notFound();

  // Delete the associated image file
  try {
    await fs.unlink(`public${product.imagePath}`);
  } catch (error) {
    console.log(`Failed to remove existing image: ${error}`);
  }

  // Find and delete the associated inventory item
  const inventory = await Inventory.findOneAndDelete({ productId: id });
  if (!inventory) {
    console.log(`No inventory item found for product ID: ${id}`);
  }
}

export async function toggleProductAvailability(id, isAvailable){
  await dbConnect()

  const updatedProduct = await Product.findOneAndUpdate({_id:id}, {isAvailableForPurchase: !isAvailable})

  if(!updatedProduct) return notFound(); 
}

export async function getNoOfOrderByProduct(productId){
  await dbConnect()

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

export async function verifyQuantity(productId, selectedQuantity) {
  await dbConnect()

  try {
    // Find the inventory item by product ID
    const inventoryItem = await Inventory.findOne({ productId });

    if (!inventoryItem) {
      // Handle no inventory item found
      return {
        success: false,
        message: 'Inventory item not found'
      };
    }

    // Check if selectedQuantity is lower or equal to inventory quantity
    if (selectedQuantity <= inventoryItem.quantity) {
      return {
        success: true,
        message: 'Quantity is valid'
      };
    } else {
      return {
        success: false,
        message: 'Selected quantity exceeds inventory'
      };
    }

  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'An error occurred while verifying quantity'
    };
  }
}

export async function decreaseProductQuantity(productId, selectedQuantity) {
  await dbConnect()

  try {
    // Find the inventory item by product ID
    const inventoryItem = await Inventory.findOne({ productId });

    if (!inventoryItem) {
      // Handle no inventory item found
      return {
        success: false,
        message: 'Inventory item not found'
      };
    }

    // Check if selectedQuantity is greater than inventory quantity
    if (selectedQuantity > inventoryItem.quantity) {
      return {
        success: false,
        message: 'Selected quantity exceeds inventory'
      };
    }

    // Decrease the inventory quantity by selectedQuantity
    inventoryItem.quantity -= selectedQuantity;

    // Save the updated inventory item
    await inventoryItem.save();

    return {
      success: true,
      message: 'Quantity decreased successfully'
    };

  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: 'An error occurred while decreasing quantity'
    };
  }
}

export async function getSalesData() {
  try {
      const salesInfo = await Order.aggregate([
          {
              $group: {
                  _id: null,
                  totalSalesInCents: { $sum: "$pricePaidInCents" },
                  numberOfSales: { $sum: 1 } // Count the number of documents
              }
          }
      ]);

      // Extract total sales amount and number of sales from aggregation result
      const totalSalesInCents = salesInfo.length > 0 ? salesInfo[0].totalSalesInCents : 0;
      const numberOfSales = salesInfo.length > 0 ? salesInfo[0].numberOfSales : 0;

      // Convert total sales amount to dollars
      const totalSalesInDollars = totalSalesInCents / 100;

      return { totalSalesInDollars, numberOfSales };
  } catch (error) {
      console.error("Error calculating total sales and number of sales:", error);
      throw error;
  }
}

export async function getUsersData() {
  try {
      const usersSpendInfo = await Order.aggregate([
          {
              $group: {
                  _id: '$userId', // Group by userId
                  totalSpendInCents: { $sum: '$pricePaidInCents' }, // Calculate total spend
                  numberOfOrders: { $sum: 1 } // Count number of orders
              }
          },
          {
              $group: {
                  _id: null,
                  totalUsers: { $sum: 1 }, // Count number of users
                  totalSpendInCents: { $sum: '$totalSpendInCents' }, // Calculate total spend across all users
                  totalOrders: { $sum: '$numberOfOrders' } // Count total number of orders
              }
          }
      ]);

      // Calculate average spend per user
      const averageSpendInCents = usersSpendInfo.length > 0 ? usersSpendInfo[0].totalSpendInCents / usersSpendInfo[0].totalOrders : 0;

      return {
          totalUsers: usersSpendInfo.length > 0 ? usersSpendInfo[0].totalUsers : 0,
          averageSpent: averageSpendInCents / 100 // Convert average spend to dollars
      };
  } catch (error) {
      console.error("Error calculating users average spend:", error);
      throw error;
  }
}

export async function getProductsData() {
  try {
      const productCounts = await Product.aggregate([
          {
              $group: {
                  _id: '$isAvailableForPurchase',
                  count: { $sum: 1 }
              }
          }
      ]);

      let availableCount = 0;
      let nonAvailableCount = 0;

      productCounts.forEach(count => {
          if (count._id === true) {
              availableCount = count.count;
          } else {
              nonAvailableCount = count.count;
          }
      });

      return {
          availableCount: availableCount,
          nonAvailableCount: nonAvailableCount
      };
  } catch (error) {
      console.error("Error counting available products:", error);
      throw error;
  }
}


