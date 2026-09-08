CREDITORS LEDGER
================
A record of the suppliers you buy from: what you purchased, what you paid,
what is still owed and how old each unpaid bill is.

Your five suppliers and every entry from the original spreadsheet are already
loaded. Nothing is sent anywhere - the data lives on the device you use it on.


TWO PINs
--------
  Owner       1234    everything, including Excel download and settings
  Data entry  1111    only the register, and only purchases, credit notes
                      and debit notes - payments stay with the owner

CHANGE BOTH before you hand the file to anyone: sign in as owner, Data tab,
Users section.

A word on what the PIN is: it keeps the wrong person out of the wrong screen,
the way a drawer key does. It is not encryption. Anyone who opens index.html in
a text editor can read the figures. So the real protection is being careful
about who gets a copy of this folder.


TWO WAYS TO USE IT
------------------

A. JUST OPEN IT  (nothing to set up)
   Double-click  index.html.
   It opens in your browser and works fully offline. Everything works except
   the "Install app" button, which no browser offers for a file opened from
   disk. This is fine for one computer.

B. INSTALL IT AS AN APP  (about 2 minutes, free, no account)
   A browser only offers "Install" when the page comes from an https address.
   So put this folder online once:

     1. Go to  https://app.netlify.com/drop
     2. Drag this whole creditors-ledger folder onto the page.
     3. You get an address like  https://silly-name-1234.netlify.app
     4. Open it and bookmark it. That address is your app.

   Then:
     Laptop, Chrome or Edge - click "Install app" in the header, or the
       install icon at the right of the address bar. It gets its own window
       and its own icon.
     Android, Chrome - tap "Install app" in the header, or menu then
       "Add to Home screen".
     iPhone or iPad - must be Safari. Share button, then "Add to Home Screen".
       Apple gives no install button, so this manual step is the only way.

   Once installed the service worker caches everything, so it opens with no
   internet at all.


EACH DEVICE KEEPS ITS OWN DATA
------------------------------
This is the one thing to be clear about. Installing on a laptop and a phone
gives you two separate sets of records. They do NOT sync.

To move data across, use the Data tab:
  on the first device   Backup (.json)
  on the second device  Restore from backup

Real cross-device syncing needs a server, which this app deliberately does not
have - your creditor figures never leave your own devices.


BACKUPS
-------
Everything is stored in the browser. Clearing browsing data will erase it.
Download a backup from the Data tab regularly and keep it somewhere else.
  Backup (.json)  restores the app exactly as it was
  Excel (.xlsx)   five sheets for reading, not for restoring


WHAT IS IN EACH SCREEN
----------------------
  Balance       what you owe each supplier on any date you pick, split by how
                old the unpaid bills are. Click a name to open its ledger.
  Party ledger  one supplier's full year, running balance, and a form to add
                an entry with bill number and remark
  Register      the month grid, one row per supplier - closest to the old
                spreadsheet. Amber cells hold more than one entry that day.
  Daily         everything that happened on one date
  Parties       add or remove suppliers, opening balances, carry forward
  Data          year summary, Excel, backup, restore, PINs


HOW THE AGEING IS WORKED OUT
----------------------------
Payments are applied to the oldest bill first. "Oldest unpaid" is therefore
the age of the earliest bill not yet fully cleared - not an average, and not
the age of the whole balance.

An opening balance is treated as dated 1 April. If it carries bills older than
that, their real age is understated.


UPDATING LATER
--------------
Replace index.html, change  CACHE = 'creditors-v4'  in sw.js to 'creditors-v5',
and drag the folder to Netlify Drop again.


FILES
-----
  index.html            the whole app, a single self-contained file
  manifest.webmanifest  name, colours and icons for installing
  sw.js                 offline cache
  icon-192.png          Android home screen
  icon-512.png          splash screen
  apple-touch-icon.png  iPhone home screen
