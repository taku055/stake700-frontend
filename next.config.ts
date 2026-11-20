import path from "path";
import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: path.join(process.cwd()),
  // Browsers request /favicon.ico on their own; serve the PNG we have.
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/favicon.png" }];
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: { test?: RegExp }) => rule.test instanceof RegExp && rule.test.test(".svg"),
    );

    const svgr = {
      loader: "@svgr/webpack",
      options: { icon: true },
    };

    if (!fileLoaderRule) {
      config.module.rules.push({
        test: /\.svg$/i,
        resourceQuery: /component/,
        use: [svgr],
      });
      return finalize(config);
    }

    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: /component/,
        use: [svgr],
      },
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: [/component/] },
      },
    );
    fileLoaderRule.exclude = /\.svg$/i;
    return finalize(config);
  },
};

function finalize(config: { module: { rules: unknown[] }; watchOptions?: object }) {
  config.module.rules.push({
    test: /\.(tsx|ts|jsx|js)$/,
    include: path.join(process.cwd(), "src"),
    enforce: "pre",
    use: {
      loader: "babel-loader",
      options: {
        babelrc: false,
        configFile: false,
        parserOpts: { plugins: ["typescript", "jsx"] },
        plugins: ["module:@preact/signals-react-transform"],
      },
    },
  });
  config.watchOptions = {
    ...(config.watchOptions ?? {}),
    ignored: ["**/.git/**", "**/node_modules/**", "**/.next/**"],
  };
  return config;
}

/**
 * NEXT_PUBLIC_* values are baked into the bundle at build time. Building
 * without the API address ships a site that calls "/undefined/v1/...", so
 * stop the build instead (e.g. env vars missing in the Vercel project).
 */
function assertBuildEnv() {
  const api = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
  let problem = "";
  if (!api) problem = "NEXT_PUBLIC_BACKEND_URL is not set";
  else if (!/^https?:\/\/[^/]/.test(api)) problem = `NEXT_PUBLIC_BACKEND_URL must be an absolute URL (got "${api}")`;
  else if (process.env.VERCEL && /\/\/(localhost|127\.|0\.0\.0\.0)/.test(api)) {
    problem = `NEXT_PUBLIC_BACKEND_URL points to ${api}, which visitors cannot reach`;
  }
  if (problem) {
    throw new Error(`${problem}. Set it in the deployment's environment variables (Vercel: Settings → Environment Variables) and build again.`);
  }
}

export default function config(phase: string): NextConfig {
  if (phase === PHASE_PRODUCTION_BUILD) assertBuildEnv();
  return nextConfig;
}
