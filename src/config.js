// paiol — app configuration. The Dropbox app key is a PUBLIC client id (PKCE uses no secret),
// so it lives in the shipped file. The redirect URI must EXACTLY match one registered in the
// Dropbox App Console; we pick by origin.

// Set this to the App key of an App-folder Dropbox application owned by Quitutes do Paiol.
// Never reuse the Gentropic application when moving the site to a new owner.
export const DROPBOX_APP_KEY = '';
export const APP_VERSION = '0.3.46';
export const APP_URL = 'https://quitutespaiol.github.io/paiol/';

// Where Dropbox stores everything (App-folder app → relative to /Apps/Paiol/).
export const REMOTE_BUSINESS_PATH = '/business.yaml';
// Local IndexedDB database name (via @gcu/vfs idb backend).
export const LOCAL_DB_NAME = 'paiol';

/**
 * The OAuth redirect URI for the current origin. Must be registered verbatim in the App Console:
 *   - http://localhost:8080/        (local dev — served by tools/dev-server.js)
 *   - https://quitutespaiol.github.io/paiol/  (GitHub Pages)
 * @returns {string}
 */
export function redirectUri() {
  const { hostname } = location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:8080/';
  return APP_URL;
}
