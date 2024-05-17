import { updateSession, isAuthenticated, isAdmin } from './app/login/_actions/login';
 
export async function middleware(request) {

  const { pathname } = request.nextUrl; 
  if(pathname.includes("/checkout")) return await isAuthenticated(request); 
  if(pathname.includes("/admin")) return await isAdmin(request); 

  return await updateSession(request); 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*', "/checkout"],
}