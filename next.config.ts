import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@theatre/r3f', '@theatre/core', '@theatre/studio']
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
