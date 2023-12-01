import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware



export default authMiddleware({
  publicRoutes: ["/", "/about", "/privacy","/tos", "/support", "/legal", "/how", "/devlog", "/devlogblog", "/playground", "/mission", "/api/(.*)", "/iFrameContent/"]
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}; 


// <iframe src="https://www.askabeai.com/iFrameContent" width="600" height="400"></iframe>
