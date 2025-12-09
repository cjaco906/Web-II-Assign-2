import { Routes } from "./routes";

// https://github.com/vitejs/vite/discussions/12191
// Forces loading all images from deployment
Object.values(
  import.meta.glob("./src/images/*.{png,webp}", {
    eager: true,
  }),
);

/**
 * Visit the home view upon first visit.
 */
Routes.home();
