module.exports = {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            components: "./src/components",
            layouts: "./src/layouts"
          }
        }
      ],
      ["@babel/plugin-transform-runtime"]
    ]
}