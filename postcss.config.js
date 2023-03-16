import { postcssEsModules } from "postcss-es-modules"

export default {
  plugins: [
    postcssEsModules({
      tailwindcss: {},
      autoprefixer: {},
    })
  ]
}
