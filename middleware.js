import { updateSession, isAuthenticated, isAdmin, createUnauthorizedNextResponse } from './app/login/_actions/login';
import { NextResponse } from 'next/server';

 
export async function middleware(request) {

  const { pathname } = request.nextUrl; 
  if(pathname.includes(["/user", "/checkout"])) return await isAuthenticated(request); 

  if(pathname.includes("/admin")){
    let isUserAdmin =  await isAdmin(request); 

    if(isUserAdmin == false) return NextResponse.redirect(new URL('/', request.url)); 
      return NextResponse.next(); 
  }; 

  return await updateSession(request); 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*',"/user"],
}