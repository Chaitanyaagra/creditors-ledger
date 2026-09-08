CREDITORS LEDGER - installable app bundle
=========================================

WHY THIS FOLDER EXISTS
A browser only offers "Install" when the page comes from an https address and
has a manifest plus a service worker. A single HTML file opened by double-click
runs on file:// and can never be installed, no matter what is inside it.
Put this folder online once and the app installs on laptop and phone.

PUT IT ONLINE (about 2 minutes, free, no account needed)
1. Go to  https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. You get an address like  https://silly-name-1234.netlify.app
4. Open that address. Bookmark it. That is your app.

INSTALL ON A LAPTOP (Chrome or Edge)
- Open the address.
- Click "Install app" in the app header, or the install icon at the right of
  the address bar.
- It opens in its own window from then on, with its own icon.

INSTALL ON ANDROID (Chrome)
- Open the address.
- Tap "Install app" in the header, or menu -> "Add to Home screen".

INSTALL ON IPHONE / IPAD (must be Safari)
- Open the address in Safari.
- Share button -> "Add to Home Screen".
- iOS gives no install button, so this manual step is the only way.

AFTER INSTALLING
The service worker caches everything, so the app opens with no internet.
Your data never leaves the device - it is stored in the browser on that device.

IMPORTANT: EACH DEVICE KEEPS ITS OWN DATA
Installing on a laptop and a phone gives you two separate sets of records.
They do not sync. To move data across, use the Data tab:
  Download Excel / Backup (.json) on one device, Restore from backup on the other.

UPDATING LATER
Replace index.html, change CACHE = 'creditors-v3' in sw.js to 'creditors-v4',
and drag the folder to Netlify Drop again.

FILES
  index.html            the whole app
  manifest.webmanifest  name, colours and icons
  sw.js                 offline cache
  icon-192.png          Android home screen
  icon-512.png          splash screen and store icon
  apple-touch-icon.png  iPhone home screen
