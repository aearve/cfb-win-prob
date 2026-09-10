# CFB Win Probability — HW3

**Live site:** https://cfv-win-prob-2e16llu0b-arnavearve-2280s-projects.vercel.app

A webpage that takes a gameId from the 2025 college football season and plots each team's win
probability over the course of the game, assuming both teams are FBS.

## How to use it

1. Open the live site above.
2. Enter a 2025 FBS-vs-FBS gameId (try `401756846` — Kansas State vs Iowa State, week 1).
3. Click **Fetch**.

No setup, no API key, nothing to install — it's already live.

## Files

- `app/api/wp/route.ts` — server-side API route. Calls the CollegeFootballData.com API for the given
  gameId and returns the win probability data. My CFBD API key lives only in Vercel's environment
  variables here, so it's never exposed to the browser.
- `app/page.tsx` — the frontend. Takes the gameId input, calls the route above, and renders the
  win-probability chart with Recharts.

## Data

Nothing is stored or committed anywhere. Every time someone enters a gameId, the data is pulled live
from CFBD's API and passed straight to the page.
