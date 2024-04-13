import mongoose from "mongoose";
import Order from "./Order"; // Import the Order model

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    priceInCents: {
        type: Number,
        required: true
    },
    imagePath: {
        type: String
    },
    description: {
        type: String
    }, 
    isAvailableForPurchase: {
        type: Boolean 
    }
}, {
    timestamps: true // Add createdAt and updatedAt fields
});

productSchema.pre('remove', async function(next) {
    try {
        // Check if there are any orders associated with the product
        const ordersCount = await Order.countDocuments({ productIds: this._id });

        // If there are no orders associated with the product, proceed with deletion
        if (ordersCount === 0) {
            return next();
        } else {
            throw new Error('Cannot delete product with associated orders');
        }
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
});

const Product = mongoose.models?.Product || mongoose.model('Product', productSchema);

export default Product;

