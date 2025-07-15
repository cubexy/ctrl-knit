import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), commonjs()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  }
});
