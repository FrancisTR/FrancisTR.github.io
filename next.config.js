/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV = `production`;

const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        domains: ['media2.dev.to'],
        unoptimized: true,
    },
};

module.exports = nextConfig;