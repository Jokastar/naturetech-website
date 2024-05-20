import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    street:{
        type:String, 
    },
    city:{
        type:String,
    },
    postcode:{
        type:Number,
    },
    country:{
        type:String,
    }
});


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        default:"" 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    orders:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order'
    }],
    address:{
        type:addressSchema
    },
    phone:{
        type:Number
    },
    role:{
        type:String,
        immutable: true,
        default:"admin"
    }
});

userSchema.pre('remove', async function(next) {
    try {
        // Remove all orders associated with the user
        await Order.deleteMany({ userId: this._id });
        next(); // Proceed to remove the user
    } catch (error) {
        next(error); // Pass error to the next middleware
    }
});

const User = mongoose.models?.User || mongoose.model('User', userSchema); 

export default User; 