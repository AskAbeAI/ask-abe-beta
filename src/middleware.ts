import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware



export default authMiddleware({
  // "/" will be accessible to all users
  publicRoutes: ["/", "/about", "/devlog", "/devlogblog", "/how", "/mission", "/privacy", "/support", "/tos"]
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/(api|trpc)(.*)'],
};