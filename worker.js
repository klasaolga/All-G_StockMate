const FEEDBACK_FORM_URL = "https://forms.cloud.microsoft/e/LxvJrPcStk";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/feedback" || url.pathname === "/feedback/") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: FEEDBACK_FORM_URL,
          "Cache-Control": "no-store",
          "Referrer-Policy": "no-referrer",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
