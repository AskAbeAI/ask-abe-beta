/** @type {import('next').NextConfig} */
const nextConfig = {transpilePackages: ['three'],}

const withTM = require('next-transpile-modules')(['three'])
module.exports = withTM()

