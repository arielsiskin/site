import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";

// Static pages (prerendered HTML) + two server routes for the AI demos, served by one Node process on Cloud Run.
export default defineConfig({
  output: "static",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  // The old product pages now live as interactive sections of the home page.
  redirects: {
    "/omni-channel": "/#omnichannel",
    "/ia-bot": "/#iabot",
    "/voicebot": "/#voicebot",
    "/synergy-wfm": "/#wfm",
    "/conversational-platform": "/#iabot",
    "/v2": "/",
  },
});
