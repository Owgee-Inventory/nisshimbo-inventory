const ASSET_HEADERS = {
  'cache-control': 'public, max-age=31536000, immutable',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetPath = url.pathname === '/' ? '/index.html' : url.pathname;
    const assetUrl = new URL(request.url);
    assetUrl.pathname = assetPath;

    const response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status === 404 && !assetPath.includes('.')) {
      const fallbackUrl = new URL(request.url);
      fallbackUrl.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(fallbackUrl, request));
    }

    const headers = new Headers(response.headers);
    if (assetPath.startsWith('/_next/') || assetPath.endsWith('.png') || assetPath.endsWith('.zip')) {
      Object.entries(ASSET_HEADERS).forEach(([key, value]) => headers.set(key, value));
    }
    return new Response(response.body, { status: response.status, headers });
  },
};
