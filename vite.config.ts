import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  resolve: {
    tsconfigPaths: true
  }
});
