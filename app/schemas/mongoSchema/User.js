import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        default:"",
        required:true 
    },
    lastname:{
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
    },
    phone:{
        type:Number
    },
    password:{
        type:String,
        required:true
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