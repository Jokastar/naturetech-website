"use server";
import fs from "fs/promises"; 
import { notFound, redirect } from "next/navigation";
import Product from "../../../schemas/mongoSchema/Product"; 
import Order from "@/app/schemas/mongoSchema/Order";
import Inventory from "@/app/schemas/mongoSchema/Inventory"; 
import mongoose from "mongoose";
import dbConnect from "../../../lib/db"; 
import {productSchema} from "../../../schemas/zodSchema/productSchema"; 
import { eurosToCents } from "@/app/lib/currencyFormat";
import sharp from 'sharp';

export async function addNewProduct(prevState, formData) {
  await dbConnect();

  const formDataObj = Object.fromEntries(formData.entries());

  console.log("formData: ", formData);

  // Format the product name
  let productName = formDataObj.name;
  productName = productName.replace(/\s+/g, '_').toLowerCase();

  const productImagesFiles = formData.getAll('productImages');

  // Create the product subdirectory
  const productDir = `public/products/${productName}`;
  await fs.mkdir(productDir, { recursive: true });

  let productImageMiniature = "";

  // Store and optimize each image in the product subdirectory
  const productImagesUrls = await Promise.all(
    productImagesFiles.map(async (file) => {
      const buffer = await file.arrayBuffer();

      // Create full-size optimized image
      const optimizedImageBuffer = await sharp(Buffer.from(buffer))
        .webp({ quality: 80 }) 
        .toBuffer();
      const imagePath = `${productDir}/${crypto.randomUUID()}-${file.name.replace(/\.[^/.]+$/, '')}.webp`;
      await fs.writeFile(imagePath, optimizedImageBuffer);

      // If the image name contains "perspective", create a miniature version
      if (file.name.includes('perspective')) {
        const miniatureImagePath = `${productDir}/${crypto.randomUUID()}-${file.name.replace(/\.[^/.]+$/, '')}-mini.webp`;
        const miniatureImageBuffer = await sharp(Buffer.from(buffer))
          .resize(100, 100)
          .webp({ quality: 80 })
          .toBuffer();
        await fs.writeFile(miniatureImagePath, miniatureImageBuffer);
        productImageMiniature = miniatureImagePath.replace('public', ''); // Remove 'public' from the path for use in URLs
      }

      return imagePath.replace('public', ''); // Remove 'public' from the path for use in URLs
    })
  );


  try {
    const newProduct = new Product({
      name: formDataObj.name, // Use original name for product
      frontProductImageUrl: productImagesUrls.find(image => image.includes('front')),
      productImagesUrls: productImagesUrls,
      productImageMiniature: productImageMiniature, // Add the miniature image path
      description: formDataObj.description,
      sizes:["39", "40", "41", "42", "43", "44", "45"]
    });

    await newProduct.save();

    const newInventoryItem = new Inventory({
      productId: newProduct._id,
      quantity: parseInt(formDataObj.quantity, 10),
      priceInCents: parseInt(eurosToCents(formDataObj.price), 10), // Assuming formDataObj.price is in cents
      isAvailableForPurchase: true
    });

    await newInventoryItem.save();

  } catch (e) {
    console.log(e);
    return;
  }
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
          isAvailable: inventoryItem.isAvailableForPurchase,
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

export async function getListOfProducts(productIds) {
  await dbConnect(); // Ensure database connection
  try {
    // Fetch products and their corresponding prices from Inventory
    const products = await Product.find({ _id: { $in: productIds } });
    const inventories = await Inventory.find({ productId: { $in: productIds } });

    // Create a map of product prices by productId
    const priceMap = {};
    inventories.forEach(inventory => {
      priceMap[inventory.productId] = inventory.priceInCents;
    });

    // Attach prices to products
    const productsWithPrices = products.map(product => ({
      ...product.toObject(),
      priceInCents: priceMap[product._id]
    }));

    return { success: true, products: productsWithPrices };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message };
  }
}

export async function getAvailableProducts() {
  await dbConnect();

  try {
    // Query to find products that are available for purchase
    const availableProducts = await Inventory.find({ isAvailableForPurchase: true }).exec();
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

  // Format the product name
  let productName = data.name;
  productName = productName.replace(/\s+/g, '_').toLowerCase();

  const productImagesFiles = formData.getAll('productImages');

  // Create the product subdirectory if it doesn't exist
  const productDir = `public/products/${productName}`;
  await fs.mkdir(productDir, { recursive: true });

  // Store each image in the product subdirectory
  const productImagesUrls = await Promise.all(
    productImagesFiles.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const imagePath = `${productDir}/${crypto.randomUUID()}-${file.name}`;
      await fs.writeFile(imagePath, Buffer.from(buffer));
      return imagePath.replace('public', ''); // Remove 'public' from the path for use in URLs
    })
  );

  try {
    // Find the existing product by ID
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return notFound();
    }

    // Construct the paths to the existing image files
    const existingImagePaths = existingProduct.productImages.map(imagePath => `public${imagePath}`);

    // Check if the image files exist before attempting to delete them
    try {
      if (existingProduct.productImages) {
        for (const imagePath of existingImagePaths) {
          await fs.unlink(imagePath);
        }
      }
    } catch (error) {
      console.log(`Failed to remove existing images: ${error}`);
    }

    // Update the existing product fields with the new data
    existingProduct.name = data.name;
    existingProduct.description = data.description;
    existingProduct.productImages = productImagesUrls;

    // Find the associated inventory item
    const inventoryItem = await Inventory.findOne({ productId: id });

    if (!inventoryItem) {
      return notFound();
    }

    // Update the inventory fields
    inventoryItem.priceInCents = parseInt(data.price, 10); // Assuming data.price is in cents
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

  // Delete the associated image files
  try {
    for (const imagePath of product.productImagesUrls) {
      await fs.unlink(`public${imagePath}`);
    }
  } catch (error) {
    console.log(`Failed to remove existing images: ${error}`);
  }

  // Find and delete the associated inventory item
  const inventory = await Inventory.findOneAndDelete({ productId: id });
  if (!inventory) {
    console.log(`No inventory item found for product ID: ${id}`);
  }
}

export async function toggleProductAvailability(id, isAvailable) {
  await dbConnect();

  // Find the product by ID to ensure it exists
  const product = await Product.findById(id);
  if (!product) return notFound();

  // Find the associated inventory item using the product ID
  const inventory = await Inventory.findOne({ productId: id });
  if (!inventory) return notFound();

  // Toggle the product's availability in the inventory item
  inventory.isAvailableForPurchase = !isAvailable;

  try {
    // Save the updated inventory item
    await inventory.save();
  } catch (e) {
    console.error(`Failed to update product availability: ${e}`);
    throw e; // Re-throw the error to handle it in the calling function
  }
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
      message:error.message
    };
  }
}

export async function getTotalSales() {
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

export  async function getSalesFromLast7Days() {
  await dbConnect();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const sales = await Order.aggregate([
      {
          $match: {
              createdAt: { $gte: startDate }
          }
      },
      {
          $group: {
              _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              totalSales: { $sum: "$pricePaidInCents" }
          }
      },
      {
          $sort: { _id: 1 }
      }
  ]);

  const formattedSales = sales.map(sale => ({
      day: new Date(sale._id).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
      total: sale.totalSales  // Convert cents to dollars
  }));

  return  formattedSales; 
}

export async function getAverageOrderValue() {
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
export async function getAverageOrderValueFromLas7Days() {
  await dbConnect();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // Change the range as needed

  const sales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        totalSales: { $sum: "$pricePaidInCents" },
        orderCount: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const dailyAOV = sales.map(sale => ({
    day: new Date(sale._id).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
    total: sale.totalSales / sale.orderCount / 100 // Convert cents to dollars
  }));

  return dailyAOV;
}

export async function getAvailableProduct() {
  await dbConnect();

  try {
    const productCounts = await Inventory.aggregate([
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
      availableCount,
      nonAvailableCount
    };
  } catch (error) {
    console.error("Error counting available products:", error);
    throw error;
  }
}

export async function getTotalOrders(){
  try {
      const totalOrders = await Order.countDocuments();
      return totalOrders;
  } catch (error) {
      console.error("Error getting total orders:", error);
      throw error;
  }
};


export async function getOrderCountFromLast7Days() {
  await dbConnect();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const orders = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const formattedOrders = orders.map(order => ({
    day: new Date(order._id).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
    total: order.count
  }));

  return formattedOrders;
}


