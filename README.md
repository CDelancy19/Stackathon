# Tennis-Events

This app is designed to scrape the web for ATP and WTA tennis tournaments and upload them to a subscribable Google calendar. This app uses Nightmare.js and Google Apis to accomplish this.

Check out the app at: https://tennis-events.netlify.app/

## Start

This repo can be forked and cloned from https://github.com/CDelancy19/Stackathon.
After cloning to your machine run `npm install` to install needed dependencies.
The app now uses SQLite for storage by default, so no PostgreSQL configuration is required.
Running `npm run start:dev` will both start your server and build your client side files using webpack. After running, the app will immediately scrape for current tournaments.

### Ultimate Tennis API

The server now uses the [Ultimate Tennis API](https://rapidapi.com/cantagalloedoardo/api/ultimate-tennis1) via RapidAPI. Set your RapidAPI key in the environment variable `RAPIDAPI_KEY` before starting the server:

```bash
RAPIDAPI_KEY=your_key npm start
```

Then you can query the API via `/api/tennis/search?q=player` to search for players. The key is read from `process.env` so it stays out of version control.

## Netlify Identity and Neon

Sample Netlify Functions have been added under `netlify/functions` to illustrate how to use Netlify Identity JWTs with a Neon (Postgres) database. Provide a `DATABASE_URL` environment variable and the functions can store and retrieve favorited players and match subscriptions for authenticated users.
