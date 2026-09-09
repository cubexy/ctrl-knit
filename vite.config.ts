import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), commonjs()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  resolve: {
    tsconfigPaths: true
  }
});
