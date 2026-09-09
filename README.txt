CREDITORS LEDGER
================
A record of the suppliers you buy from: what you purchased, what you paid,
what is still owed and how old each unpaid bill is.

Your five suppliers and every entry from the original spreadsheet are already
loaded. Nothing is sent anywhere unless you turn cloud sync on - the data
otherwise lives only on the device you use it on.


BROWSERS WON'T OFFER TO SAVE THE PIN
--------------------------------------
The PIN box is deliberately not a real password field, so Chrome, Edge and
password managers like LastPass or 1Password never prompt to save it or
suggest autofilling it - anyone with access to a signed-in browser's saved
passwords could otherwise read it straight off. It is still masked with dots
on Chrome, Edge, Safari and most Android keyboards; a small number of other
browsers (older Firefox builds) may show it as plain digits while typing,
which is a cosmetic difference only.


THREE PINs
----------
  Owner       1234    everything, including Excel download and settings
  Data entry  1111    only the register, and only purchases, credit notes
                      and debit notes - payments stay with the owner
  Viewer      2580    every screen, for looking at and exporting figures -
                      cannot add, edit, delete, archive, lock or change
                      anything at all, anywhere

CHANGE ALL THREE before you hand the file to anyone: sign in as owner, Data
tab, Users section.

The Viewer role is for someone who should be able to see the whole ledger -
an accountant, a partner, anyone who just needs the numbers - without any
risk of them accidentally (or deliberately) changing something. Every screen
opens for them, but every input is either hidden or shown as read-only, and
the app double-checks this in code as well as in what it displays, the same
way the Data-entry role is enforced.

A word on what the PIN is: it keeps the wrong person out of the wrong screen,
the way a drawer key does. It is not encryption. Anyone who opens index.html
in a text editor can read the figures, and if cloud sync is on, that file
also carries the connection details to your shared ledger. So the real
protection is being careful about who gets a copy of this folder.


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


CLOUD SYNC IS ALREADY BUILT IN
-------------------------------
This copy of the app is already configured to sync to one shared ledger. You
do not need to open the Data tab, paste any URL, or set up anything on each
device - install it anywhere and it connects on its own after you sign in
with the PIN. Each entry and each supplier syncs as its own record, so you
can add a payment on your laptop while your data-entry person adds a
purchase on their phone, and neither wipes out the other. If a device is
offline it keeps working and catches up when it reconnects.

If you ever want to CHANGE which ledger it syncs to (a new Firebase project,
for instance), open Data tab > Cloud sync, paste the new databaseURL, and
Save. That device switches to the new ledger; other devices keep using the
one baked into their own copy of index.html until you update them too.

If you want a device to stop syncing altogether - a phone that is being sold,
say - open Data tab > Cloud sync > Turn off. That device keeps its records
but stops sending or receiving updates. Other devices are not affected.

HOW IT WAS SET UP, FOR REFERENCE
  Firebase project: creditors-43f30, Realtime Database in us-central1.
  Authentication: Anonymous sign-in enabled, so the PIN stays the only thing
  anyone types - Firebase handles the connection quietly behind it.
  Rules restrict reads and writes to signed-in connections:

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

WHAT THIS PROTECTS YOU FROM, AND WHAT IT DOES NOT
  It does stop:      anyone scanning the internet for open Firebase databases.
                      That is the common real-world way these leak, and the
                      rule "auth != null" shuts it.
  It does not stop:  anyone who has a copy of index.html, since the config is
                      baked in. The PIN is checked in the browser, not by
                      Firebase, so such a person can read and change the
                      whole ledger. Do not put the app on a public address
                      you hand out, and only install it on devices you or
                      your staff control.
  For a real lock, switch Authentication to Email/Password with one account
  per person - then Firebase, not the browser, decides who gets in.

  A middle option exists: keep anonymous sign-in, but restrict the database
  rules to only the specific device UIDs you approve, instead of any
  anonymous connection at all - e.g. ".write": "auth.uid === 'abc123...'"
  for each device, found under Authentication > Users in the Firebase
  console after that device has signed in once. This is real hardening, but
  it is not something this app can set up for you: it means going into the
  Firebase console by hand every time you add a device, which is the exact
  per-device setup this app was built to avoid. Worth doing only if that
  trade-off suits you.


SAVING AND SYNC STATUS
-----------------------
The app saves by itself - there is nothing to click. The status sits in the
header on every screen:

  Saving...              a change is on its way to storage
  Saved * 12:46:46 pm    written and read back to confirm it is really there
  Not saved - retrying   it failed; it retries automatically every 10 seconds
  Not saved - storage full   it has stopped retrying; download a backup and
                              free up space

There is also a "Save now" button in the header, and Ctrl+S (Cmd+S on a Mac),
for peace of mind - you should not need either.

Signing out (see LOCKING below) disconnects cloud sync cleanly, so nothing
keeps talking to the shared ledger once you are no longer signed in on that
device. Signing back in reconnects and catches up automatically.


LOCKING THE APP ITSELF (separate from locking a financial year)
------------------------------------------------------------------
By default the app locks the moment you leave it - close the window, switch
to another app, minimise it - and asks for the PIN again when you come back.
It also signs you out after 15 minutes of nothing happening, whichever
setting below you pick.

On a laptop, where you may be flicking to Excel and back all day, that can
get tiresome. The owner can loosen it on the Data tab, under Users:

  The moment I leave the app     (default)
  After 30 seconds away
  After 2 minutes away
  Only when the app is closed

This setting travels with the ledger, so every device behaves the same way.


DELETING AN ENTRY
------------------
Deleting a purchase, payment, credit note or debit note happens straight
away and shows an "Undo" for eight seconds, rather than asking first.
Removing a supplier with no history, and resetting the whole app, still ask
first, because those are not quietly reversible the same way.


ARCHIVING A SUPPLIER
---------------------
Removing a supplier that has any transaction history is called Archive
instead of Remove. It hides that supplier from the Register and Daily-entry
screens, so you stop scrolling past someone you no longer buy from, but every
figure stays exactly where it is - Balance, the Parties table, Excel, CSV,
the Year summary. Unarchive brings it straight back, no confirmation needed.
Only a supplier with zero transactions in every year can be removed for good,
since there is nothing to lose in that case.


EDIT HISTORY
-------------
Changing an amount already entered in the Register - not adding a new one,
changing an existing figure - is recorded: who changed it, when, and what it
was before. On the Party ledger tab, a changed entry shows an "edited x2"
tag; tap it to see the full history. The last 10 changes are kept per entry.
The Excel export's Transactions sheet has a matching "Times edited" column.
This is a lightweight note for your own reference, not a full accounting
audit trail - it covers amount changes on entries only, not supplier or
opening-balance edits, and it lives inside the record itself rather than a
separate log.


FINANCIAL YEAR LOCKING
------------------------
Once a year is finalised, lock it from the Year summary table on the Data
tab. A locked year refuses new purchases, payments, notes, opening-balance
edits, and new suppliers dated inside it, on every screen, with a clear
message pointing back to the Data tab. Unlocking works the same way, with
its own confirmation.

This is enforced by each device once it has heard about the lock, not by the
cloud database itself. A device that is offline when a year is locked could
still add an entry to it before reconnecting and learning about the change.
Treat this as a safeguard against accidental edits during ordinary use, not
as a tamper-proof seal.


THINGS THE APP WILL TELL YOU ABOUT
------------------------------------
  "Your saved data could not be read"
      Shown at sign-in. Sample figures appear but NOTHING is overwritten and
      saving stays paused until you decide. Download the unreadable file
      from that screen first - it may be recoverable.
  "Opening balance no longer matches..."
      Something in last year was edited after balances were carried forward.
      Open Parties and carry forward again.
  "An identical ... already exists"
      A matching party + date + type + amount entry is already there.
      Usually a double tap.
  "FY 20XX-XX is locked"
      See FINANCIAL YEAR LOCKING above.
  "Anonymous sign-in is not enabled" / "Database rules refused access"
      A cloud setup step was skipped - see the CLOUD SYNC section above.


BACKUPS
-------
Everything is stored in the browser. Clearing browsing data will erase it.
Download a backup from the Data tab regularly and keep it somewhere else.
  Backup (.json)  restores the app exactly as it was, including PINs and
                  settings
  Excel (.xlsx)   five sheets for reading and reporting, not for restoring


WHAT IS IN EACH SCREEN
------------------------
  Balance       what you owe each supplier on any date you pick, split by how
                old the unpaid bills are, with an ageing donut and a search
                box. Click a name to open its ledger.
  Party ledger  one supplier's full year, running balance, paid/unpaid tags,
                edit-history tags, and a form to add an entry with a bill
                number and remark.
  Register      two ways in. "Month grid" is the old spreadsheet layout, one
                row per supplier across the month - best on a laptop. "One
                day" picks a date and gives each supplier a single big box,
                which is what you want on a phone; it also shows what each
                supplier is owed as you go. Phones open in day mode, laptops
                in grid mode, and you can switch either way. Amber boxes hold
                more than one entry that day - tap to open the ledger at that
                date.
  Daily         everything that happened on one date, across every supplier
  Parties       add, archive or remove suppliers, opening balances, carry
                balances forward into next year
  Data          year summary with financial-year locking, Excel and backup
                export/restore, cloud sync settings, PINs, app-lock timing,
                and which build of the app you are running


HOW THE AGEING IS WORKED OUT
-------------------------------
Payments are applied to the oldest bill first. "Oldest unpaid" is therefore
the age of the earliest bill not yet fully cleared - not an average, and not
the age of the whole balance.

An opening balance is treated as dated 1 April. If it carries bills older
than that, their real age is understated.


WHICH COPY AM I LOOKING AT?
------------------------------
The build number sits under the title in the header, and again on the Data
tab, together with a short history of what changed in each build. If a
feature described here is missing from your screen, you are on an older
copy - replace index.html and reload.

This bundle is build 24: cloud sync (9), auto sign-out on exit (10), the
phone-friendly register layout (11), undo on delete (12), cloud sync baked
into every install (14), a mobile card-view text fix (15), no more flash of
stale sample figures on a brand-new device (16), archiving, edit history and
financial-year locking (17), the browser no longer offers to save the PIN as
a password (18), a view-only Viewer role (19), several multi-device sync
correctness fixes (20), offline-shell reliability fixes (21), proper
comma-formatted amount fields (22), an always-today default date (23), and
design/accessibility fixes described below (24).


DESIGN FIXES IN BUILD 24
-----------------------------
  - Two colour pairs fell short of accessibility contrast guidelines: white
    text on the gold buttons (Add entry, Download Excel, and others), and
    the muted grey used for zero-value figures in tables. Both are now
    comfortably legible while keeping the same look and feel.
  - Every "no suppliers yet" screen - Balance, the Party ledger, Register,
    Daily - now gives the owner a direct "Go to Parties" button instead of
    only a text hint, and takes you straight to the name field to start
    typing. This only appears for the owner, since data entry and viewer
    sign-ins cannot add a supplier anyway.


DEFAULT DATE IN BUILD 23
-----------------------------
Opening the app used to show Balance and Daily as on the date of that
device's last saved entry, not today. Most of the time these were close
enough not to notice, but any gap between them - a device that had not been
used in a few days, or one that had synced slightly behind another - showed
up as different figures on different devices, which looked like the data
itself disagreed when it was really just the date being looked at that
disagreed. Every device now opens showing today, every time, and only shows
an older date if you deliberately pick one. Which financial year opens by
default is unaffected - that still sensibly follows where your data lives -
only the specific date does not.


AMOUNT FIELDS IN BUILD 22
-----------------------------
The transaction amount field, the new-supplier opening balance field, and
each supplier's opening-balance box on the Parties tab now show the number
with proper Indian comma grouping - 1,50,000 rather than 150000 - once you
leave the field, matching how every figure already looks on the Balance and
Ledger screens. Typing is unaffected; the formatting is only applied when
you move on to something else.

This needed a matching fix underneath: those same fields used to be parsed
with a plain number conversion that breaks on a comma, which would have
silently saved a comma-formatted opening balance as zero. They now go
through the same parser as every other amount in the app, so a value you
can see is always the value that gets saved.


OFFLINE SHELL FIXES IN BUILD 21
-----------------------------------
  - "Today" is now worked out fresh every time it is needed, not fixed once
    when the app is opened. Left running across midnight, the app now
    correctly recognises the new day instead of still thinking it is
    yesterday, which affected the future-date warning among other things.
  - The service worker used to re-fetch the whole app over the network to
    work out its own cache name on every single file it cached, all
    session long. It now works that out once and reuses it, which also
    removes the small risk of a flaky connection leaving different files
    in inconsistent caches.
  - The offline shell (index.html) now answers instantly from the cached
    copy while quietly checking for a newer one in the background, rather
    than waiting on the network first. This matters most on a slow or
    patchy connection - the app opens immediately instead of hanging.
    Because your actual figures live in local storage and in Firebase, not
    in this cached shell, this never risks showing an old number - only,
    briefly, one session behind on the code itself, which the background
    check then catches up.
  - That background refresh is now guaranteed to finish saving before the
    browser is allowed to end the service worker, so a slow moment can no
    longer leave it half-done.


MULTI-DEVICE SYNC FIXES IN BUILD 20
--------------------------------------
A careful review of the cloud sync code turned up real bugs, all fixed here:

  - An edit made in the moment between one save going out and the previous
    one finishing could be silently dropped instead of queued for next time.
  - A device that was offline when a PIN, an app-lock timing choice, or a
    financial-year lock was changed elsewhere could overwrite that change
    with its own stale copy the next time it synced anything at all, even
    something unrelated like an ordinary purchase entry. Settings now only
    go up when the device that is pushing actually changed them itself.
  - Restore and Reset updated the screen correctly but did not properly
    bring the shared cloud ledger in line - old records could resurface
    later from another device. Both now tombstone what was removed and
    push the full replacement.
  - Changing only the Viewer PIN did not reach other signed-in devices.
  - The app-lock timing setting was sent to the cloud but never read back
    on another device, so it did not actually travel with the ledger as
    documented.
  - The full backup (.json) was missing financial-year locks, the app-lock
    timing setting, and deletion history, despite the app describing it as
    complete.
  - The Excel button was visible to the Viewer role but silently did
    nothing when clicked. It now works for Viewer as well as Owner.
  - Undo, after deleting an entry, could in principle act after signing out
    or after that year had since been locked. Signing out now clears any
    waiting Undo, and Undo itself re-checks both before acting.
  - Entry timestamps now correct themselves against Firebase's own clock,
    so a device with a slightly wrong system clock no longer risks having
    its genuinely later edits treated as older than someone else's.


UPDATING LATER
-----------------
Replace index.html and drag the folder to Netlify Drop again. The service
worker reads its own cache name from index.html's BUILD line at install
time, so there is no second file to remember to bump by hand.

If the app still looks old after an upload, close every window of it and
reopen, twice if needed, so the new service worker gets a chance to take
over. index.html itself is fetched network-first once installed, so this is
rarely necessary.


FILES
-----
  index.html            the whole app, a single self-contained file
  manifest.webmanifest  name, colours and icons for installing
  sw.js                 offline cache, self-versioning from index.html
  icon-192.png          Android home screen
  icon-512.png          splash screen
  apple-touch-icon.png  iPhone home screen
