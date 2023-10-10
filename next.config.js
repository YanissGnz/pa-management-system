/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard/students",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/dashboard/students",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
