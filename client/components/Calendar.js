import React, { useEffect, useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';

// Calendars formerly embedded via iframe
const CALENDAR_IDS = [
  'e527mg89157iu9jrsomarru2s4@group.calendar.google.com',
  'rdvbondihar5bnq15nmjd9l0ic@group.calendar.google.com',
];

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    ApiCalendar.onLoad(() => {
      const now = new Date();
      Promise.all(
        CALENDAR_IDS.map((calendarId) =>
          ApiCalendar.listEvents({
            calendarId,
            timeMin: now.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
            maxResults: 20,
          })
        )
      )
        .then((responses) => {
          const all = responses.reduce((acc, { result }) => {
            return acc.concat(result.items || []);
          }, []);
          all.sort(
            (a, b) =>
              new Date(a.start.dateTime || a.start.date) -
              new Date(b.start.dateTime || b.start.date)
          );
          setEvents(all);
        })
        .catch((err) => console.error(err));
    });
  }, []);

  return (
    <div className="calendar">
      <h3>Upcoming Events</h3>
      <ul>
        {events.map((e) => (
          <li key={e.id}>
            {e.summary} -
            {` ${new Date(e.start.dateTime || e.start.date).toLocaleDateString()}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;

