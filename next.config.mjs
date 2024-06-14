/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            process.env.MAINTENANCE_MODE === "1"
                ? {
                    source: "/((?!maintenance.html).*)",
                    destination: "/maintenance.html",
                    permanent: false,
                  }
                : null,
        ].filter(Boolean);
    }
};

export default nextConfig;
