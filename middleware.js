import { updateSession, isAuthenticated } from './app/login/_actions/login';
 
export async function middleware(request) {

   return await updateSession(request); 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}