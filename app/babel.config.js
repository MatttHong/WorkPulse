module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
      ["module-resolver", {
          root: ["./src"],
          alias: {
              "assets": "./src/assets",
              "components": "./src/components"
          }
      }],
      ["@babel/plugin-transform-runtime"]
  ]
};
