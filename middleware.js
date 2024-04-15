import { NextResponse } from 'next/server'; 
import { isAuthenticated } from './app/login/_actions/login';
 
export async function middleware(request) {

   return await isAuthenticated(request); 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}