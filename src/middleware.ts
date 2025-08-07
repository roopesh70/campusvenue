export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/genkit (Genkit routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (the login page)
     */
    '/((?!api/genkit|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
