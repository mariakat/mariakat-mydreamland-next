import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The cPanel server can't run the native image optimizer (old GLIBC),
    // so images are served as-is: from /public or straight from the CMS.
    unoptimized: true,
  },
};

export default nextConfig;
