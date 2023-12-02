import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware


function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
  
  frame-ancestors 'self' *.strikingly.com;  
  
`
  // style-src 'self' 'nonce-${nonce}';
  // img-src 'self' blob: data:;
  // font-src 'self';
  // object-src 'none';
  // base-uri 'self';
  // form-action 'self';
  // default-src 'self';
  // script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
  // block-all-mixed-content;
  // upgrade-insecure-requests;

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()
 
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set("Access-Control-Allow-Credentials", "true")
  requestHeaders.set('Access-Control-Allow-Origin', 'https://www.strikingly.com')
  requestHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  requestHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        // Include any other headers you might need for your requests
    
 
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
 
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )
  response.headers.set('x-nonce', nonce)
  response.headers.set("Access-Control-Allow-Credentials", "true")
  response.headers.set('Access-Control-Allow-Origin', 'https://www.strikingly.com')
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
 
  return response
}

export default authMiddleware({
  beforeAuth: (req) => {
    // Execute next-intl middleware before Clerk's auth middleware
    return middleware(req);
  },
  publicRoutes: ["/","/about", "/privacy","/tos", "/support", "/legal", "/how", "/devlog", "/devlogblog", "/playground", "/mission", "/api/(.*)"],
  ignoredRoutes: ["/embed", "/api/externalAPI/vitalia"],
  debug: true,
});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/'],
}; 


// <iframe src="https://www.askabeai.com/embed" referrerpolicy="origin-when-cross-origin" width="600" height="400"></iframe>
// authenticateRequest state is interstitial, {
//   "status": "interstitial",
//   "reason": "uat-missing",
//   "message": "",
//   "frontendApi": "adequate-termite-83.clerk.accounts.dev",
//   "publishableKey": "pk_test_YWRlcXVhdGUtdGVybWl0ZS04My5jbGVyay5hY2NvdW50cy5kZXYk",
//   "isSatellite": false,
//   "domain": "",
//   "proxyUrl": "",
//   "signInUrl": "",
//   "isSignedIn": false,
//   "isInterstitial": true,
//   "isUnknown": false
// }



// "headers": "{\"accept\":\"*/*\",\"accept-encoding\":\"gzip, deflate, br\",\"accept-language\":\"en-US,en;q=0.9\",\"connection\":\"Keep-Alive\",\"content-length\":\"3892\",\"cookie\":\"__clerk_db_jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJkdmJfMll2YWdJbXlPU1BZSW5MUDF1Q2NOQVAwR3FtIn0.VVgDRTLDmrlEmSKhNSygEpjgZHicVTSVtgdbVPOnfhrN6nJDf-xIGpSnftCUQODeVlCAXOyPxJL_ukDZbhGtxr7RlsSMwHMolJAeo0MuY4tVPTmHtkH7-Gnbq8jhRZX1f0Yi8-fUs_CvOKKWX_QnBn25CaPzl4mV7jmBHwlGOEKZvzXAmzmhgmF-HfXXEOfRZ8uQ6ChSzzSiRMIDg2WYORELtu6ePX9e3jSNh1U5ouPFBe-sS88z68niiIFJHJXsibts975HgJOYbTXlSkBrA-pLKNfcLLeH57Tfar7zzO-NzwZ3iD_idEaaUg9Cm8hwOL7as0ngSxgjb2pX_1qfkA; __client_uat=0\",\"forwarded\":\"for=73.222.15.103;host=www.askabeai.com;proto=https\",\"host\":\"www.askabeai.com\",\"next-url\":\"/embed\",\"referer\":\"https://www.askabeai.com/embed\",\"sec-ch-ua\":\"\\\"Google Chrome\\\";v=\\\"119\\\", \\\"Chromium\\\";v=\\\"119\\\", \\\"Not?A_Brand\\\";v=\\\"24\\\"\",\"sec-ch-ua-mobile\":\"?0\",\"sec-ch-ua-platform\":\"\\\"macOS\\\"\",\"sec-fetch-dest\":\"empty\",\"sec-fetch-mode\":\"cors\",\"sec-fetch-site\":\"same-origin\",\"user-agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36\",\"x-forwarded-for\":\"73.222.15.103\",\"x-forwarded-host\":\"www.askabeai.com\",\"x-forwarded-proto\":\"https\",\"x-real-ip\":\"73.222.15.103\",\"x-vercel-deployment-url\":\"ask-abe-beta-pwz2fqz1t-will-diamonds-projects.vercel.app\",\"x-vercel-edge-region\":\"sfo1\",\"x-vercel-id\":\"sfo1::lf7mh-1701409775270-b95db3020f0f\",\"x-vercel-ip-city\":\"Los%20Altos\",\"x-vercel-ip-country\":\"US\",\"x-vercel-ip-country-region\":\"CA\",\"x-vercel-ip-latitude\":\"37.3793\",\"x-vercel-ip-longitude\":\"-122.12\",\"x-vercel-ip-timezone\":\"America/Los_Angeles\",\"x-vercel-proxied-for\":\"73.222.15.103\"}",

// "headers": "{\"accept\":\"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\",\"accept-encoding\":\"gzip, deflate, br\",\"accept-language\":\"en-US,en;q=0.9\",\"connection\":\"Keep-Alive\",\"content-length\":\"3892\",\"forwarded\":\"for=73.222.15.103;host=www.askabeai.com;proto=https\",\"host\":\"www.askabeai.com\",\"referer\":\"https://www.strikingly.com/\",\"sec-ch-ua\":\"\\\"Google Chrome\\\";v=\\\"119\\\", \\\"Chromium\\\";v=\\\"119\\\", \\\"Not?A_Brand\\\";v=\\\"24\\\"\",\"sec-ch-ua-mobile\":\"?0\",\"sec-ch-ua-platform\":\"\\\"macOS\\\"\",\"sec-fetch-dest\":\"iframe\",\"sec-fetch-mode\":\"navigate\",\"sec-fetch-site\":\"cross-site\",\"upgrade-insecure-requests\":\"1\",\"user-agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36\",\"x-forwarded-for\":\"73.222.15.103\",\"x-forwarded-host\":\"www.askabeai.com\",\"x-forwarded-proto\":\"https\",\"x-real-ip\":\"73.222.15.103\",\"x-vercel-deployment-url\":\"ask-abe-beta-pwz2fqz1t-will-diamonds-projects.vercel.app\",\"x-vercel-edge-region\":\"sfo1\",\"x-vercel-id\":\"sfo1::vz5bl-1701409587899-7ade10bd301a\",\"x-vercel-ip-city\":\"Los%20Altos\",\"x-vercel-ip-country\":\"US\",\"x-vercel-ip-country-region\":\"CA\",\"x-vercel-ip-latitude\":\"37.3793\",\"x-vercel-ip-longitude\":\"-122.12\",\"x-vercel-ip-timezone\":\"America/Los_Angeles\",\"x-vercel-proxied-for\":\"73.222.15.103\"}",
