const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: path.resolve(__dirname, "public/assets/js/index.js"),
  output: {
    path: path.resolve(__dirname, "public/dist"),
    filename: "bundle.js"
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new WebpackPwaManifest({
      name: "Budget Tracker",
      short_name: "Budget",
      description: "Budget Tracker keeps track of your Budget, with or without an internet connection.",
      background_color: "#dddddd",
      theme_color: "#317EFB",
      "theme-color": "#317EFB",
      fingerprints: false,
      start_url: "/",
      icons: [{
        src: path.resolve(__dirname, "public/assets/icons/icon-512x512.png"),
        sizes: [96, 128, 192, 256, 384, 512],
        destination: path.join("assets", "icons")
      }]
    })
  ]
};

module.exports = config;
