const ASSET_HEADERS = {
  'cache-control': 'public, max-age=31536000, immutable',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);
    if (response.status === 404 && url.pathname !== '/') {
      const fallbackUrl = new URL(request.url);
      fallbackUrl.pathname = '/';
      return env.ASSETS.fetch(new Request(fallbackUrl, request));
    }

    const headers = new Headers(response.headers);
    if (url.pathname.startsWith('/_next/') || url.pathname.endsWith('.png') || url.pathname.endsWith('.zip')) {
      Object.entries(ASSET_HEADERS).forEach(([key, value]) => headers.set(key, value));
    }
    return new Response(response.body, { status: response.status, headers });
  },
};
