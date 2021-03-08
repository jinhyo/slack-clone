import path from "path";
import webpack from "webpack";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
// import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const isDevelopment = process.env.NODE_ENV !== "production";

const config: webpack.Configuration = {
  name: "slack-clone-frontend",
  mode: isDevelopment ? "development" : "production",
  devtool: !isDevelopment ? "hidden-source-map" : "eval",
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], // babel이 처리할 확장자 목록
    alias: {
      "@hooks": path.resolve(__dirname, "hooks"), // import A from ../../../ 없어도 가능하게. tsconfig.json에서도 해줘야함
      "@components": path.resolve(__dirname, "components"), // code를 칠때는 typscript 검사기가 tsconfig를 보고 확인하고
      "@layouts": path.resolve(__dirname, "layouts"), // 실제로 자바스크립트로 바꿔주는 webpack은 여길 보고 확인함
      "@pages": path.resolve(__dirname, "pages"),
      "@utils": path.resolve(__dirname, "utils"),
      "@typings": path.resolve(__dirname, "typings"),
    },
  },
  entry: {
    app: "./client", // client.tsx를 받음
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // ts, tsx 파일을 babel-loader가 바꿔줌
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { browsers: ["last 2 chrome versions"] },
                debug: isDevelopment,
              },
            ],
            "@babel/preset-react",
            "@babel/preset-typescript",
          ],
          env: {
            development: {
              plugins: [
                // ["@emotion", { sourceMap: true }],
                require.resolve("react-refresh/babel"), // hot reloading용
              ],
            },
            //   production: {
            //     plugins: ["@emotion"],
            //   },
          },
        },
        exclude: path.join(__dirname, "node_modules"),
      },
      {
        test: /\.css?$/, // css파일을 "style-loader", "css-loader"이 자바스크립트로 바꿔줌
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      // typscript와 webpack의 타입 검사를 동시에 돌아가게 해서 성능을 높여줌
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    new webpack.EnvironmentPlugin({
      // react에서 접근할 수 없는 process.env.NODE_ENV 변수를 사용할 수 있게 해줌
      NODE_ENV: isDevelopment ? "development" : "production",
    }),
  ],
  output: {
    // 결과물이 나오는 폴더
    path: path.join(__dirname, "dist"),
    filename: "[name].js", // = entry에 추가한 이름인 app을 따라 app.js파일을 생성
    publicPath: "/dist/",
  },
  devServer: {
    // hot reloading용 개발 서버
    historyApiFallback: true, // react router를 위해 필요
    port: 3090,
    publicPath: "/dist/",
    proxy: {
      // cors 에러를 프론트엔드에서 해결하는 방법
      "/api/": {
        target: "http://localhost:3095", // 앞에 /api/가 붙으면  보내는 주소를 백엔드와 동일(http://localhost:3095)한 주소로 바꿔서 보냄
        changeOrigin: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin()); // hot reloading용
  config.plugins.push(new ReactRefreshWebpackPlugin()); // hot reloading용
  //   config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
// if (!isDevelopment && config.plugins) {
//   config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
//   config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
// }

export default config;
