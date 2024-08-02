/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/auth',
          permanent: false, // Use `true` for permanent redirects
        },
      ];
    },
  };

export default nextConfig;
