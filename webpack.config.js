import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

import webpack from "webpack";
import dotenv from "dotenv";
dotenv.config();

export default {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true, // Cleans old files in dist/ before each build
  },
  devtool: "eval-source-map", // Accurate source maps for debugging
  devServer: {
    watchFiles: ["./src/index.html"], // Live reload when HTML template changes
    open: true, // Automatically opens browser on server start
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_NINJA_KEY": JSON.stringify(
        process.env.API_NINJA_KEY || "",
      ),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      // CSS Loader
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // HTML Loader (for image links in HTML templates)
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      // Image Assets (png, svg, jpg, jpeg, gif)
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
