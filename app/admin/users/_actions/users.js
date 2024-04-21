import User from "@/app/schemas/mongoSchema/User";
import userSchema from "@/app/schemas/zodSchema/userSchema";
import dbConnect from "../../../lib/db"; 

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
        name: data.name,
        email: data.email, 
        role: data.role
    })

      await newUser.save(); 

  }catch(e){
    //solve this error better
    console.log(e); 
    return notFound(); 
  }

  redirect("/admin/users"); 
  
}

export async function getUsers() {
  await dbConnect()
  try {

    let users = await User.find({}); // Fetch products from the database

    users = users.map(user => ({
      ...user.toObject(),
      _id: user._id.toString()
    })); 

    return users

  } catch (error) {
    console.error(error);
      return []; 
  }
}

export async function getUserById(id){
  const user = await User.findOne({_id:id}).lean(); 
  if(!user) return notFound();
  return user; 
}

export async function deleteUser(id){
  await dbConnect()
  const user = await User.findOneAndDelete({_id:id}); 
  if(!user) return notFound();
  return "use deleted"; 
}

export async function updateUser(id, prevState, formData){ 
  await dbConnect()
  const formDataObj = Object.fromEntries(formData.entries());
  
  const result = await userSchema.safeParse(formDataObj); 

  if(!result.success){
    const formattedErrors = result.error.flatten().fieldErrors;
  
        return formattedErrors; 
  }
  
  const data = result.data; 

  // Check if there's an image in the form data

  try {
    // Find the existing product by ID
    const existingUser = await User.findById(id).lean();

    if (!existingUser) {
      return notFound(); 
    }

    // Update the existing product fields with the new data
    existingUser.name = data.name;
    existingUser.email = data.email;
    existingUser.role = data.role;

    // Save the updated product
    await existingUser.save(); 

  } catch(e) {
    //handle better this error
    console.log(e); 
    return notFound(); 
    
  }

  // Redirect after successful update
  redirect("/admin/users"); 
}



