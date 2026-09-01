export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetRequest = url.pathname === '/'
      ? new Request(new URL('/index.html', request.url), request)
      : request;

    return env.ASSETS.fetch(assetRequest);
  },
};
