import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware



export default authMiddleware({
  ignoredRoutes: ['/api/externalAPI/vitalia/route'],
  publicRoutes: ["/", "/about", "/privacy","/tos", "/support", "/legal", "/how", "/devlog", "/devlogblog", "/playground", "/mission", "/api/(.*)"]
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; // sadly this doesn't work