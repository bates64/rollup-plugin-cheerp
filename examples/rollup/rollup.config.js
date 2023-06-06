import cheerp from "rollup-plugin-cheerp"

/** @type {import("rollup").RollupOptions}*/
export default {
  input: "src/index.js",
  output: [
    {
      dir: "dist",
      format: "es",
    },
  ],
  plugins: [cheerp()],
}
