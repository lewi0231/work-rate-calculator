/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment-specific configuration
  env: {
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
  }),

  // Development settings
  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: ["10.40.40.250"],
  }),

  // Image optimization
  images: {
    unoptimized: false,
  },

  // Output configuration
  output: "standalone",

  // Experimental features
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: false,
              dimensions: false,
              svgProps: {
                className: "{props.className}",
              },
              replaceAttrValues: {
                "#141a46": "currentColor",
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
