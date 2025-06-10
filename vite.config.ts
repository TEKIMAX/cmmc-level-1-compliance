import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Development tools injection
    mode === "development"
      ? {
          name: "inject-dev-tools",
          transform(code: string, id: string) {
            if (id.includes("main.tsx")) {
              return {
                code: `${code}

/* Added by Vite plugin inject-dev-tools */
window.addEventListener('message', async (message) => {
  if (message.source !== window.parent) return;
  // Handle development preview requests
  console.log('Development mode active');
});
            `,
                map: null,
              };
            }
            return null;
          },
        }
      : null,
    // End of development tools injection.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
