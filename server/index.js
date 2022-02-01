const { db } = require('./db');
const PORT = process.env.PORT || 8080;
const app = require('./app');
const seed = require('../script/seed');
// Require google from googleapis package.
const { google } = require('googleapis');

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth;

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
	'517072930998-p1ajhmbjadua369e7i5m21vtns54qo95.apps.googleusercontent.com',
	'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'
);

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
	refresh_token:
		'1//04WLWYD3NrGV5CgYIARAAGAQSNwF-L9Ir07Hi1QWcwxvJ3Dx6QNY_nOtFmoPw6HeLJxqjSFP0cRVZ-Uu42vWcGzoPn4S3ZpiNRH8',
});

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// // Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDay() + 2);

// // Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDay() + 2);
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

const Nightmare = require('nightmare');

const getMensEvent = async () => {
	const nightmare = new Nightmare();
	// Go to initial start page, navigate to Detail search
	try {
		nightmare
			.goto('https://www.atptour.com/en/tournaments')
			.wait('.tourney-result')
			.evaluate(() => {
				let searchResults = [];
				const results = document.querySelectorAll('.tourney-result');
				results.forEach(function (result) {
					let summary =
						result.getElementsByClassName('tourney-title')[0].innerText;
					let location =
						result.getElementsByClassName('tourney-location')[0].innerText;
					let description = result.getElementsByClassName(
						'tourney-details-table-wrapper'
					)[0].innerText;
					let startDate = result
						.getElementsByClassName('tourney-dates')[0]
						.innerHTML.trim()
						.slice(0, 10)
						.replace('.', '-')
						.replace('.', '-');
					let endDate = result
						.getElementsByClassName('tourney-dates')[0]
						.innerText.trim()
						.slice(13, 23)
						.replace('.', '-')
						.replace('.', '-');
					let row = {
						summary: summary,
						location: location,
						description: description,
						start: {
							date: startDate,
						},
						end: {
							date: endDate,
						},
					};
					searchResults.push(row);
				});
				return searchResults;
			})
			.end()
			.then(function (result) {
				result.forEach(function (r, index) {
					setTimeout(function () {
						// Check if we are busy and have an event on our calendar for the same time.
						const calendarId =
							'e527mg89157iu9jrsomarru2s4@group.calendar.google.com';

						// Create an array of all events on our calendar
						calendar.events.list(
							{
								calendarId: calendarId,
								singleEvents: true,
							},
							async function (err, res) {
								if (err) {
									console.log('The API returned an error: ' + err);
									return;
								}
								let eventsList = await res.data.items;
								// console.log('THIS IS THE EVENTS LIST:', eventsList);
								// console.log('THIS IS THE TO-BE-CREATED EVENT:', r);

								var resultObject = eventsList.find(
									(o) => o['summary'] === r['summary']
								);

								// console.log('THIS IS THE RESULT OBJECT:', resultObject);

								if (resultObject === undefined) {
									//  Create a new event only if the event doesn't already exist

									console.log(r.summary, ' needs to be added');
									return calendar.events.insert(
										{
											calendarId: calendarId,
											resource: r,
										},
										(err) => {
											// Check for errors and log them if they exist.
											if (err) {
												return console.log(
													'Error Creating Calender Event:',
													err
												);
											}
											// Else log that the event was created.
											return console.log(
												"Men's Calendar event successfully created."
											);
										}
									);
								} else {
									// If event exists, update the found event
									return calendar.events.update(
										{
											calendarId: calendarId,
											eventId: resultObject.id,
											sendUpdates: 'all',
											resource: r,
										},
										console.log(r.summary, ' has been updated')
									);
								}
							}
						);
					}, 2000 * (index + 1));
				});
			});
	} catch (e) {
		console.error(e);
	}
};

const getWomensEvent = async () => {
	const nightmare = new Nightmare();
	// Go to initial start page, navigate to Detail search
	try {
		nightmare
			.goto(
				'https://tennisproguru.com/tournament-winners-rackets/wta-2022-tournament-schedule-with-winners/'
			)
			.wait('.full-container')
			.evaluate(() => {
				let searchResults = [];
				const results = document.querySelectorAll('tr');
				results.forEach(function getResults(result) {
					let summary = result.getElementsByClassName('column-4')[0].innerText;
					let location = result.getElementsByClassName('column-5')[0].innerText;
					let description =
						'Surface: ' +
						result.getElementsByClassName('column-6')[0].innerText;
					let startDate = result
						.getElementsByClassName('column-2')[0]
						.innerHTML.trim()
						.slice(0, 5)
						.replace('/', '-')
						.concat('-2022')
						.split('-');
					let start_Date = [];
					start_Date.push(startDate[2], startDate[0], startDate[1]);
					let lastStartDate = start_Date.join('-');
					let endDate = result
						.getElementsByClassName('column-2')[0]
						.innerHTML.slice(8, 13)
						.replace('/', '-')
						.concat('-2022')
						.split('-');
					let end_Date = [];
					end_Date.push(endDate[2], endDate[0], endDate[1]);
					let lastEndDate = end_Date.join('-');
					let row = {
						summary: summary,
						location: location,
						description: description,
						start: {
							date: lastStartDate,
						},
						end: {
							date: lastEndDate,
						},
					};
					searchResults.push(row);
				});
				searchResults.shift();
				searchResults.shift();
				searchResults.pop();
				return searchResults;
			})
			.end()
			.then(function (result) {
				result.forEach(function (r, index) {
					setTimeout(function () {
						// Check if we are busy and have an event on our calendar for the same time.
						const calendarId =
							'rdvbondihar5bnq15nmjd9l0ic@group.calendar.google.com';

						// Create an array of all events on our calendar
						calendar.events.list(
							{
								calendarId: calendarId,
								singleEvents: true,
							},
							async function (err, res) {
								if (err) {
									console.log('The API returned an error: ' + err);
									return;
								}
								let eventsList = await res.data.items;
								// console.log('THIS IS THE EVENTS LIST:', eventsList);
								// console.log('THIS IS THE TO-BE-CREATED EVENT:', r);

								var resultObject = eventsList.find(
									(o) => o['summary'] === r['summary']
								);

								// console.log('THIS IS THE RESULT OBJECT:', resultObject);

								// If event exists, update the found event
								if (resultObject !== undefined) {
									return calendar.events.update(
										{
											calendarId: calendarId,
											eventId: resultObject.id,
											sendUpdates: 'all',
											resource: r,
										},
										console.log(r.summary, ' has been updated')
									);
								} else {
									console.log(r.summary, ' needs to be added');
									//  Create a new event only if the event doesn't already exist

									return calendar.events.insert(
										{
											calendarId: calendarId,
											resource: r,
										},
										(err) => {
											// Check for errors and log them if they exist.
											if (err) {
												return console.log(
													'Error Creating Calender Event:',
													err
												);
											}
											// Else log that the event was created.
											return console.log(
												"Women's Calendar event successfully created."
											);
										}
									);
								}
							}
						);
					}, 2000 * (index + 1));
				});
			});
	} catch (e) {
		console.error(e);
	}
};

getMensEvent();
getWomensEvent();

const init = async () => {
	try {
		if (process.env.SEED === 'true') {
			await seed();
		} else {
			await db.sync();
		}
		// start listening (and create a 'server' object representing our server)
		app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
	} catch (ex) {
		console.log(ex);
	}
};

init();
