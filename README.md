# Tennis-Events

This app is designed to scrape the web for ATP and WTA tennis tournaments and upload them to a subscribable Google calendar. This app uses Nightmare.js and Google Apis to accomplish this.

Ckeckout the app at: https://tennis-events.herokuapp.com/

## Start

This repo can be forked and cloned from https://github.com/CDelancy19/Stackathon.
After cloning to your machine run `npm install` to install needed dependencies.
The app now uses SQLite for storage by default, so no PostgreSQL configuration is required.
Running `npm run start:dev` will both start your server and build your client side files using webpack. After running, the app will immediately scrape for current tournaments.
