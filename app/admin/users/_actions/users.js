"use server"; 

import User from "@/app/schemas/mongoSchema/User";
import userSchema from "@/app/schemas/zodSchema/userSchema";
import dbConnect from "../../../lib/db"; 
import { getSession } from "@/app/login/_actions/login";

export async function addNewUser(prevState, formData){ 
    await dbConnect()
    const formDataObj = Object.fromEntries(formData.entries())
    
    const result = await userSchema.safeParse(formDataObj); 

    if(!result.success){
        const formattedErrors = result.error.flatten().fieldErrors;
  
        return formattedErrors; 
    }
    const data = result.data;  
  try{

    const newUser =  await new User({
        firstname: data.firstname,
        email: data.email, 
        role: data.role
    })

      await newUser.save();
      return {success:true, message:"user created"} 

  }catch(e){
    console.log(e); 
    return {success:false, error:e.message}
  } 
}

export async function getUsers() {
  await dbConnect()
  try {

    let users = await User.find({}); // Fetch products from the database

    users = users.map(user => ({
      ...user.toObject(),
      _id: user._id.toString()
    })); 

    return {success:true, users:users}

  } catch (error) {
    console.error(error);
      return {success:false, message:"No users"}; 
  }
}

export async function getUserById(id){
  await dbConnect(); 
  try{
    const user =  await User.findOne({ _id: id })
    .select('-role -password')
    .populate({
      path: 'orders',
      populate: {
        path: 'products.productId',
        model: 'Product'
      }
    })
    .lean();
    
    if(!user) throw new Error ("User not found"); 
    return {success:true, user:user};

  }catch(e){
    console.log(e)
    return {success:false, error:e.message}
  } 
}

export async function deleteUser(id){
  await dbConnect()
  const user = await User.findOneAndDelete({_id:id}); 
  if(!user) return notFound();
  return {success:"true",  message:"user deleted"}; 
}

export async function updateUser(id, prevState, formData){ 
  await dbConnect()
  const formDataObj = Object.fromEntries(formData.entries());
  console.log(JSON.stringify(formDataObj)); 
  const result = await userSchema.safeParse(formDataObj); 

  if(!result.success){
    const formattedErrors = result.error.flatten().fieldErrors;
  
        return formattedErrors; 
  }
  
  const data = result.data; 

  try {
    // Find the existing product by ID
    const existingUser = await User.findById(id)

    if (!existingUser) {
      return {success:false, message:"User not found"};
    }

    // Update the existing product fields with the new data
    existingUser.name = data.name;
    existingUser.email = data.email;
    existingUser.role = data.role;

    // Save the updated product
    await existingUser.save(); 
    return {success:true, message:"user updated"}

  } catch(e) {
    //handle better this error
    console.log(e); 
    return notFound(); 
    
  }

  // Redirect after successful update
  redirect("/admin/users"); 
}
export async function updateUserInfos(id, userInfos){ 
  await dbConnect(); 
  
  try {
    // Find the existing product by ID
    const existingUser = await User.findById(id)

    if (!existingUser) {
      return {success:false, error:"User not found"};
    }

    // Update the existing product fields with the new data
    const address = {
      street:userInfos.street,
      city:userInfos.city,
      postcode:userInfos.postcode,
      country:userInfos.country
    }
    existingUser.firstname = userInfos.firstname;
    existingUser.lastname = userInfos.lastname;
    existingUser.email = userInfos.email;
    existingUser.phone = userInfos.phone; 
    existingUser.address = address; 
    


    // Save the updated product
    await existingUser.save();
    return {success:true, message: "user updated"} 

  } catch(e) {
    //handle better this error
    console.log(e); 
    return {success:false, error: e.message} 
    
  } 
}


export async function getUser() {
  try {
    // Get the session
    const session = await getSession();
    if (!session) {
      throw new Error('No session found');
    }

    // Get the user ID from the session
    const userId = session.id; // Adjust this based on your session structure
    if (!userId) {
      throw new Error('Invalid session data');
    }

    // Fetch the user by ID
    const response = await getUserById(userId);
    if (!response.success) {
      throw new Error(response.message);
    }

    // Return the user data
    return { success: true, user: response.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}








