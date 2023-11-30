import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware



export default authMiddleware({
  publicRoutes: ["/", "/about", "/privacy","/tos", "/support", "/legal", "/how", "/devlog", "/devlogblog", "/playground", "/mission", "/api/(.*)"],
  afterAuth(auth, req, ev) {
    const res = NextResponse.next();
    if (req.nextUrl.pathname === '/api/externalAPI/vitalia') {
      res.headers.append('Access-Control-Allow-Credentials', "false")
      res.headers.append('Access-Control-Allow-Origin', '*') 
      res.headers.append('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.headers.append('Access-Control-Allow-Headers', 'Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date')
    }
  }
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; // sadly this doesn't work
