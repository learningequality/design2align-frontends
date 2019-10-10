const VueAutoRoutingPlugin = require("vue-auto-routing/lib/webpack-plugin");
const webpack = require("webpack");

module.exports = {
  configureWebpack: () => {
    const config = {
      output: {},
      plugins: [
        new VueAutoRoutingPlugin({
          // Path to the directory that contains your page components.
          pages: "src/apps",

          // A string that will be added to importing component path (default @/pages/).
          importPrefix: "@/apps/"
        })
      ]
    };
    if (process.env.NODE_ENV === "production") {
      // Do this to add `__webpack_hash__` variable to production build
      config.plugins.push(new webpack.ExtendedAPIPlugin());
      config.output.filename = "js/[name].[hash].js";
      config.output.chunkFilename = "js/[name].[hash].js";
    }
    return config;
  }
};
