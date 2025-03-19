import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';


export function getPreloadPath() {
  const p = path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/preload.cjs'
  );

  console.log(p);

  return p;
}

export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-react/index.html');
}

export function getAssetPath() {
  return path.join(app.getAppPath(), isDev() ? '.' : '..', '/src/assets');
}