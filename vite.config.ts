// TODO dev/prod config
// TODO PWA setup (use plugin)
// TODO Check build config
import { defineConfig } from "vite";
/**
 * ---------------------------------------------------------------------------
 * DEV_NOTES: The APIs being used here gonna require HTTPS. The basicSsl plugin
 * provides very basic SSL for use in dev, tis enough.
 */
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    basicSsl()
  ],
  worker: {
    plugins: [
    ]
  }
});
