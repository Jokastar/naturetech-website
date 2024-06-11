import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity:{
    
    type:Number, 
    required:true
  },
  priceInCents: {
    type: Number,
    required: true,
    min: 0
  },
  isAvailableForPurchase:{
    type:Boolean,
    required:true
  }
}, {
  timestamps: true
});



// Create a model
const Inventory = mongoose.models?.Inventory || mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;