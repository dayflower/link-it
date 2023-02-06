import { defineManifest } from '@crxjs/vite-plugin';
import { name, version } from './package.json';

const names = {
  build: name,
  serve: `[DEV] ${name}`,
};

// import to `vite.config.ts`
export default defineManifest((env) => ({
  manifest_version: 3,
  name: names[env.command],
  version,
  icons: {
    '16': 'icons/icon16.png',
    '32': 'icons/icon32.png',
    '48': 'icons/icon48.png',
    '128': 'icons/icon128.png',
  },
  permissions: [
    'clipboardWrite',
    'contextMenus',
    'activeTab',
    'scripting',
    'notifications',
  ],
  action: {
    default_title: 'Link It!',
  },
  background: {
    service_worker: 'src/worker.ts',
  },
}));
