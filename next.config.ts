import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  outputFileTracingRoot: path.join(process.cwd()),
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

export default nextConfig;
