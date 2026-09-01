import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const exportedSite = resolve(projectRoot, 'out');
const siteBundle = resolve(projectRoot, 'dist');

if (!existsSync(exportedSite)) {
  throw new Error('Next.js did not create the static export in out/');
}

rmSync(siteBundle, { recursive: true, force: true });
mkdirSync(resolve(siteBundle, 'client'), { recursive: true });
cpSync(exportedSite, resolve(siteBundle, 'client'), { recursive: true });
mkdirSync(resolve(siteBundle, 'server'), { recursive: true });
writeFileSync(
  resolve(siteBundle, 'server/index.js'),
  `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetRequest = url.pathname === '/'
      ? new Request(new URL('/index.html', request.url), request)
      : request;

    return env.ASSETS.fetch(assetRequest);
  },
};
`,
);

console.log(`Prepared Cloudflare-compatible site output in ${siteBundle}`);
