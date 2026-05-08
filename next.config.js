/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  // output: 'standalone',
  trailingSlash: true,
  reactStrictMode: false,
  webpack: (config, { dev}) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    config.stats = 'errors-only'; // Show errors only during build

    return config
  }
}
 