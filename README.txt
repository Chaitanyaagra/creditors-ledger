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


CLOUD SYNC (optional - off until you set it up)
-----------------------------------------------
Without it, each device keeps its own separate records and you move data with
Backup / Restore on the Data tab.

With it, every device that signs in shares one ledger. Each entry and each
supplier syncs as its own record, so you can add a payment on your laptop while
your data-entry person adds a purchase on their phone, and neither wipes out the
other. If a device is offline it keeps working and catches up when it reconnects.

SETTING IT UP  (about 10 minutes, free tier is plenty)

 1. Go to  https://console.firebase.google.com  and create a project.

 2. Build > Realtime Database > Create Database.
    Pick a location, then choose LOCKED MODE. Not test mode.
    You do not need to note anything down.

 3. Realtime Database > Rules. Replace everything with:

      {
        "rules": {
          "ledgers": {
            "$ledger": {
              ".read":  "auth != null",
              ".write": "auth != null"
            }
          }
        }
      }

    Publish.

 4. Build > Authentication > Get started > Sign-in method >
    ANONYMOUS > Enable > Save.
    That is all. You do not create any user accounts. The app signs itself in
    in the background; you and your staff keep using the PIN as before.

 5. Project settings (gear icon) > Your apps > Web app (</> icon) if you have
    not registered one already.

 6. Open the app as owner, Data tab, Cloud sync. apiKey, projectId and
    authDomain are already filled in.
    In the databaseURL box, paste the whole link from your browser's address
    bar while you are on the Realtime Database Data page. Leave region on
    "Work it out for me" - the app checks all three regions and keeps the one
    your database answers from.
    Save and turn on. Sign out, sign back in with your PIN, and it syncs.

 7. On the second device, install the app and do step 6 with the same values.
    A device that has never been used adopts whatever is already in the cloud,
    so nothing gets duplicated. The PINs travel with the ledger, so a PIN you
    change on one device applies everywhere.

WHAT THIS PROTECTS YOU FROM, AND WHAT IT DOES NOT

  It does stop:  anyone scanning the internet for open Firebase databases.
                 That is the common real-world way these leak, and the rule
                 "auth != null" shuts it.

  It does not stop:  anyone who has a copy of your index.html. The apiKey is
                 inside it, anonymous sign-in is open to all comers, and the
                 PIN is checked in the browser, not by Firebase. Such a person
                 can read and change the whole ledger.

  So the file itself is the thing to guard. Do not put the app on a public
  address you hand out, do not post the link anywhere, and only install it on
  devices you or your staff control.

  If you later want a real lock, switch Authentication to Email/Password and
  create one account per person. Then Firebase - not the browser - decides who
  gets in, and losing the file no longer means losing the data. Say the word
  and it can be changed over.

DARK MODE
---------
Follows your phone or laptop's own setting. Nothing to switch.


DELETING AN ENTRY
-----------------
Deleting a purchase or payment happens straight away and shows an "Undo" for
eight seconds, rather than asking first. Removing a supplier and resetting the
app still ask, because those cannot be taken back the same way.


LOCKING
-------
By default the app locks the moment you leave it - close the window, switch to
another app, minimise it - and asks for the PIN again when you come back.

On a laptop, where you may be flicking to Excel and back all day, that gets
tiresome. The owner can loosen it on the Data tab, under Users:

  The moment I leave the app     (default)
  After 30 seconds away
  After 2 minutes away
  Only when the app is closed

Whichever you pick, you are also signed out after 15 minutes of nothing
happening, so the app left open on a shared computer does not stay unlocked.
The setting travels with the ledger, so both devices behave the same way.


THINGS THE APP WILL TELL YOU ABOUT
----------------------------------
  "Storage is full"          it stops retrying instead of looping forever.
                             Download a backup, then clear space.
  "Your saved data could not be read"
                             shown at sign-in. Sample figures appear but
                             NOTHING is overwritten and saving stays paused
                             until you say so. Download the unreadable file
                             from that screen first - it may be recoverable.
  "Opening balance no longer matches..."
                             you changed something in last year after carrying
                             balances forward. Open Parties and carry again.
  "An identical ... already exists"
                             a same party, date, type and amount entry is
                             already there. Usually a double tap.
  "Anonymous sign-in is not enabled"
                             cloud setup step 4 was skipped.
  "Database rules refused access"
                             cloud setup step 3 was skipped.


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
  Register      two ways in. "Month grid" is the old spreadsheet layout, one
                row per supplier across the month - best on a laptop. "One day"
                picks a date and gives each supplier a single big box, which is
                what you want on a phone; it also shows what each supplier is
                owed as you go. Phones open in day mode, laptops in grid mode,
                and you can switch either way. Amber boxes hold more than one
                entry that day - tap to open the ledger.
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


WHICH COPY AM I LOOKING AT?
---------------------------
The build number sits under the title in the header, and again on the Data tab.
This bundle is build 12. If something described to you is missing from the
screen, you are on an older copy - replace index.html and reload.

Cloud sync arrived in build 9, locking on exit in build 10,
the phone-friendly layout in build 11,
dark mode and undo in build 12.


UPDATING LATER
--------------
Replace index.html, change  CACHE = 'creditors-v13'  in sw.js to the next
number, and drag the folder to Netlify Drop again.

If you already installed the app and it still looks old after an upload, the
old service worker is serving the cached copy. Close every window of the app
and reopen it, twice if needed. Build 9 onward's service worker fetches index.html
from the network first, so from now on updates land on the next reload.


FILES
-----
  index.html            the whole app, a single self-contained file
  manifest.webmanifest  name, colours and icons for installing
  sw.js                 offline cache
  icon-192.png          Android home screen
  icon-512.png          splash screen
  apple-touch-icon.png  iPhone home screen
