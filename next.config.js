/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.unsplash.com",
      "tailwindui.com",
      "oyrgixydgsdsaxvxksvr.supabase.co",
      "lh3.googleusercontent.com",
    ],
    loader: "custom"
  },
};

module.exports = nextConfig;
