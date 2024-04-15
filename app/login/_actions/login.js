"use server"
import { loginSchema } from "@/app/schemas/zodSchema/loginSchema";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import {NextResponse } from "next/server";
import { redirect } from "next/navigation";

const secretKey = "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
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

  const formDataObj = Object.fromEntries(formData.entries())

  const result = await loginSchema.safeParse(formDataObj);

  if (!result.success) {
  // Handle validation errors
  const formattedErrors = result.error.flatten().fieldErrors;
  return formattedErrors; 
  } else {

  const user = result.data;

  // Create the session

  const session = await encrypt( user);

  // Save the session in a cookie
  cookies().set("session", session, { httpOnly: true });
    }
  redirect("/admin")
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);

  const res = NextResponse.next();
  res.cookies.set({
    name: "session",

    value: await encrypt(parsed),
    httpOnly: true,
  });
  return res;
    }

    export async function isAuthenticated(req){
      const token = req.cookies.get("session").value;  
      // Check if cookies are present
      if (!req.cookies || !token) {
        console.log("no token")
        return NextResponse.redirect(new URL('/login', req.url))

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
        if (error.name === "JWTExpired") {
            return NextResponse.json({error:error.reason}, {status:401});
            /*TO DO: generate a new token, put it in the cookies and return the response */
        } 
      return NextResponse.json({error:"Unauthorized"}, {status:401}); // Return 401 Unauthorized if payload is not valid
    }
}
    
