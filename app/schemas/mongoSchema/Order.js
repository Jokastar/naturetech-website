import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    pricePaidInCents: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1 // Ensure quantity is at least 1
        },
        size:{
            type:String,
            required:true
        }
    }]
}, {
    timestamps: true // Add createdAt and updatedAt fields
});

const Order = mongoose.models?.Order || mongoose.model('Order', orderSchema);

export default Order;
