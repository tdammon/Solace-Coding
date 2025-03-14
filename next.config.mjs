/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[hash][ext][query]'
      }
    });
    return config;
  }
};

export default nextConfig;
