// paiol — app configuration. The Dropbox app key is a PUBLIC client id (PKCE uses no secret),
// so it lives in the shipped file. The redirect URI must EXACTLY match one registered in the
// Dropbox App Console; we pick by origin.

// Public App key for the App-folder Dropbox application owned by Quitutes do Paiol.
export const DROPBOX_APP_KEY = 'tokrzn0n86oc1f7';
export const APP_VERSION = '0.3.47';
export const APP_URL = 'https://quitutespaiol.github.io/paiol/';

// Where Dropbox stores everything (relative to this app's own Dropbox folder).
export const REMOTE_BUSINESS_PATH = '/business.yaml';
// Local IndexedDB database name (via @gcu/vfs idb backend).
export const LOCAL_DB_NAME = 'paiol';

/**
 * The OAuth redirect URI for the current origin. Production is registered verbatim in the
 * Dropbox App Console. Register localhost separately before testing Dropbox in local dev:
 *   - http://localhost:8080/        (optional local dev)
 *   - https://quitutespaiol.github.io/paiol/  (GitHub Pages)
 * @returns {string}
 */
export function redirectUri() {
  const { hostname } = location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:8080/';
  return APP_URL;
}
