"use server"
import { loginSchema, signInSchema } from "@/app/schemas/zodSchema/loginSchema";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {NextResponse } from "next/server";
import {redirect } from "next/navigation";
import User from "@/app/schemas/mongoSchema/User";
import dbConnect from "../../lib/db";
import bcrypt from 'bcryptjs'; 

const key = new TextEncoder().encode(process.env.JOSE_SECRET_KEY);

export async function encrypt(payload) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(key);
  } catch (e) {
    console.log("jwt encrypting error ", e);
    throw new Error("JWT encryption error: " + e.message);
  }
}

export async function decrypt(input) {
 
  try{
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return {success:true, payload};

  }catch(e){
   return{success:false, message:e.code}
  }
  
}

export async function login(prevState, formData) {
  await dbConnect();
  // Verify credentials && get the user
  const formDataObj = Object.fromEntries(formData.entries());

  try {
    const result = await loginSchema.safeParse(formDataObj);

    if (!result.success) {
      // Handle validation errors
      const formattedErrors = result.error.flatten().fieldErrors;
      return formattedErrors;
    }

    const data = result.data;

    // Check if the user exists 
    const existingUser = await User.findOne({ email: data.email }).lean();

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    // Check password
    const match = await bcrypt.compare(data.password, existingUser.password);

    if (!match) {
      throw new Error("Email or password incorrect");
    }

    // Create the session
    const session = await encrypt({ id: existingUser._id, email: existingUser.email, role: existingUser.role });

    // Save the session in a cookie
    cookies().set("session", session, { httpOnly: true });

    return { success: true, message: "User connected" };
  
  } catch (e) {
    console.log("login error " + e);
    return {error:e.message}
  }
}



export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function signIn(prevState, formData) {
  await dbConnect();
  
  const formDataObj = Object.fromEntries(formData.entries());

  try {
      const result = await signInSchema.safeParse(formDataObj);

      if (!result.success) {
          const formattedErrors = result.error.flatten().fieldErrors;
          throw new Error(JSON.stringify(formattedErrors));
      }

      const data = result.data;

      // Check if the user exists
      const existingUser = await User.findOne({ email: data.email });

      if (existingUser) {
          throw new Error("User already exists");
      }

      // Hash the password
      const saltRound = parseInt(process.env.BCRYPT_SALT_ROUND);
      const hashedPassword = await bcrypt.hash(data.password, saltRound);

      const newUser = new User({
          email: data.email,
          password: hashedPassword,
          firstname: data.firstname,
          role: data.role
      });

      // Save the new user to the database
      const createdUser = await newUser.save();

      // Create the session
      const session = await encrypt({ id: createdUser._id, email: newUser.email, role: newUser.role });

      // Save the session in a cookie
      cookies().set("session", session, { httpOnly: true });

      return { success: true, message: "User created" };

  } catch (e) {
      console.log("signin error: " + e);
      return {success:false, message: e.message}
  }
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  try{
    const result =  await decrypt(session);
    return result.success ? {success:true, session:result.payload} : {success:false, message:result.message}
  }catch(e){
    return {success:false, message:e.message}
  }
}

export async function updateSession(request) {
  try{
    const session = request.cookies.get("session")?.value;
    if (!session) return NextResponse.redirect(new URL('/login', request.url));

  // Refresh the session so it doesn't expire
  const {success, payload} = await decrypt(session);
  
  if(!success) return NextResponse.redirect(new URL('/login', request.url));

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",

    value: await encrypt(payload),
    httpOnly: true,
  });
  return res;
  }catch(e){
    console.log("session update error ", e); 
    return NextResponse.redirect(new URL('/login', request.url)); 
  }
  
    }

export async function isAuthenticated(request){
      const token = request.cookies.get("session")?.value;  
      // Check if cookies are present
      if (!request.cookies || !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      try {
        // Decrypt and verify the token
        const {success} = await decrypt(token); 
        // If the payload is valid, user is authenticated
        if (!success) return createUnauthorizedNextResponse(request)
        return NextResponse.next(); // Proceed to the next middleware or route handler
        
      } catch (error) {
        console.log("isAuthenticated error ", error); 
        // If the token is invalid or expired, redirect to login
        return NextResponse.redirect(new URL('/login', request.url) ); // Return 401 Unauthorized if payload is not valid
    }
}

export async function isAdmin(request){
  const token = request.cookies.get("session").value;  
      // Check if cookies are present
      if (!request.cookies || !token) {
        return NextResponse.redirect(new URL('/login', request.url)); 

      }

      try {
        // Decrypt and verify the token
        const payload = await decrypt(token); 
        // If the payload is valid, user is authenticated
        if (payload.role === "admin") {
          return NextResponse.next();
        }else{
          return createUnauthorizedNextResponse(request)
        }
      } catch (error) {
        console.log(error); 
        // If the token is invalid or expired, redirect to login
        return NextResponse.redirect(new URL('/login', request.url)); // Return 401 Unauthorized if payload is not valid
    }

}

export async function changePassword(prevState, formData) {
  await dbConnect();

  console.log(formData);
const newPassword  = formData.get("newPassword")
const currentPassword  = formData.get("currentPassword")
const confirmPassword  = formData.get("confirmPassword")
const userId = formData.get("userId"); 

const errors = {};

  // Check if newPassword and currentPassword are the same
  if (currentPassword === newPassword) {
    errors.errors = 'New password cannot be the same as the current password';
    return errors;
  } else if(newPassword !== confirmPassword){
      errors.errors = "the new password and confirm password are not the same"
      return errors
  }
  
try {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the current password is correct
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUND));
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the user's password
  user.password = hashedPassword;
  await user.save();

  return {success:true, message:"password changed"}

} catch (error) {
  console.log("changePassword error ", error); 
  return {success:false, errors:error.message}
} 
}

function createUnauthorizedNextResponse(request){
  const response = new NextResponse({ message: 'Connexion unauthorized' }, { status: 401 });
  response.headers.set('Content-Type', 'application/json');
  response.headers.set('Location', new URL('/login', request.url));
  return response;
  
}

    
