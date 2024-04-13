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
    productIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
}, {
    timestamps: true // Add createdAt and updatedAt fields
});



const Order = mongoose.models?.Order || mongoose.model('Order', orderSchema);

export default Order;
