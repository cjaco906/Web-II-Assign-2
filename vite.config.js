import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  // https://vite.dev/guide/build#public-base-path
  base: "/Web-II-Assign-2/",
});
