# CivicFix

Plain HTML/CSS/JS grievance reporting site, backed by Supabase (auth, database, storage). No frameworks, no build step — open the files in a browser or serve the folder statically.

## Pages

- `index.html` — landing page: login (Citizen/Authority toggle) + a "Create new account" button. This is the first thing anyone sees.
- `home.html` — the public bulletin: hero banner, live stats strip, filter/sort controls, and before/after photos for every closed complaint.
- `signup.html` — citizen registration.
- `raise-complaint.html` — citizens file a new complaint: title/description with a keyword-based category suggestion, a "use my location" button, and a confirmation screen showing the complaint ID once submitted.
- `track-complaint.html` — citizens see their own complaints' status; authorities can look up any complaint by ID.
- `complaints.html` — authority queue: sorted by priority, flags complaints open longer than 3 days as "Overdue", and pops a toast on login if new complaints came in since the last visit.
- `close-complaint.html` — authority uploads a proof-of-completion photo and closes a complaint.

## Setup

1. **Create a Supabase project** at supabase.com.
2. **Run the schema**: open `schema.sql`, copy it into Project → SQL Editor, and run it. This creates the `profiles` and `complaints` tables and their access policies (includes a migration snippet at the top if you already ran an earlier version).
3. **Create two storage buckets** (Storage → New bucket), both set to **Public**:
   - `complaint-photos`
   - `resolution-photos`

   Then add the read/write policies for each bucket shown in the comments at the bottom of `schema.sql`.
4. **Fill in your keys**: open `js/config.js` and paste in your project's URL and anon public key (Project Settings → API).
5. **Create an authority account.** There's no public sign-up for authorities on purpose — create one manually:
   - Sign up normally through `signup.html` with the authority's email (this creates the auth user and a `citizen` profile).
   - In Supabase → Table Editor → `profiles`, change that row's `role` from `citizen` to `authority`.
6. Open `index.html` in a browser (or serve the folder with any static file server) — everything else runs against your Supabase project.

## Notes on scope

- The `update` policy on `complaints` currently allows any logged-in user to update a complaint's status. For a real deployment, tighten it to check the caller's role is `authority` (see the comment in `schema.sql`).
- The category suggestion on `raise-complaint.html` is a simple keyword match, not a real ML model — good enough for a demo, described in the pitch as an "AI-assisted suggestion."
- The "new complaints" notification for authorities is tracked per-browser via `localStorage`, not a server-side notification system — it resets if they log in from a different device or clear browser data.
- There's no email verification gate built into the UI — depending on your Supabase auth settings, a new citizen may need to confirm their email before `index.html` will let them in.
