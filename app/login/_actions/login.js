"use server"
import { loginSchema, signInSchema } from "@/app/schemas/zodSchema/loginSchema";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {NextResponse } from "next/server";
import { notFound, redirect } from "next/navigation";
import User from "@/app/schemas/mongoSchema/User";
import dbConnect from "../../lib/db"

const key = new TextEncoder().encode(process.env.JOSE_SECRET_KEY);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2min")
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(prevState, formData) {
  // Verify credentials && get the user

  const formDataObj = Object.fromEntries(formData.entries());

  const result = await loginSchema.safeParse(formDataObj);

  if (!result.success) {
    // Handle validation errors
    const formattedErrors = result.error.flatten().fieldErrors;
    return formattedErrors; 
  }

  const data = result.data;

  await dbConnect();

  // Check if the user exists 
  const existingUser = await User.findOne({ email: data.email }).lean();

  if (!existingUser) {
     redirect("/signin");
  }

  // Create the session
  const session = await encrypt({ email: existingUser.email, role: existingUser.role });

  // Save the session in a cookie
  cookies().set("session", session, { httpOnly: true });

  return redirect("/");
}


export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
  redirect("/"); 
}

export async function signIn(prevState, formData) {
  // Verify credentials && get the user data
  const formDataObj = Object.fromEntries(formData.entries());

  const result = await signInSchema.safeParse(formDataObj);

  if (!result.success) {
    // Handle validation errors
    const formattedErrors = result.error.flatten().fieldErrors;
    return formattedErrors; 
  }

  const data = result.data;

  let existingUser;
  await dbConnect();

  // Check if the user exists
  existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    return "user already exist"
  }

  // Hash the password

  const newUser = new User({
    email: data.email,
    password: data.password,
    name: data.name,
    role: data.role 
  });

  // Save the new user to the database
  await newUser.save();

  // Create the session
  const session = await encrypt({ email: newUser.email, role: newUser.role });

  // Save the session in a cookie
  cookies().set("session", session, { httpOnly: true });

  redirect("/");
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request) {
  try{
    const session = request.cookies.get("session")?.value;
    if (!session) return NextResponse.redirect(new URL('/login', request.url));

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",

    value: await encrypt(parsed),
    httpOnly: true,
  });
  return res;
  }catch(e){
    return NextResponse.redirect(new URL('/login', request.url)); 
  }
  
    }

    export async function isAuthenticated(request){
      const token = request.cookies.get("session").value;  
      // Check if cookies are present
      if (!req.cookies || !token) {
        return NextResponse.redirect(new URL('/login', request.url)); 

      }

      try {
        // Decrypt and verify the token
        const payload = await decrypt(token); 
        // If the payload is valid, user is authenticated
        if (payload) {
          return NextResponse.next(); // Proceed to the next middleware or route handler
        }
      } catch (error) {
        console.log(error); 
        // If the token is invalid or expired, redirect to login
        return NextResponse.redirect(new URL('/login', request.url) ); // Return 401 Unauthorized if payload is not valid
    }
}
    
