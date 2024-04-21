import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',  // Refers to the Product model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  priceInCents: {
    type: Number,
    required: true,
    min: 0
  }
});

// Create a model
const Inventory = mongoose.models?.Inventory || mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;