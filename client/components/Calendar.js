/* global gapi */
import React, { useEffect, useState } from 'react';
import ApiCalendar from 'react-google-calendar-api';

const FAVORITES_CALENDAR = 'Favorite Players';

// Create or fetch a calendar dedicated to favorited players
async function getFavoritesCalendarId() {
  const list = await gapi.client.calendar.calendarList.list();
  const existing = list.result.items.find((c) => c.summary === FAVORITES_CALENDAR);
  if (existing) return existing.id;
  const created = await gapi.client.calendar.calendars.insert({
    summary: FAVORITES_CALENDAR,
  });
  return created.result.id;
}

const Calendar = ({ favorites = [] }) => {
  const [events, setEvents] = useState([]);
  const [calendarId, setCalendarId] = useState(null);

  // Authenticate and ensure the favorites calendar exists
  useEffect(() => {
    ApiCalendar.onLoad(() => {
      ApiCalendar.handleAuthClick()
        .then(getFavoritesCalendarId)
        .then(setCalendarId)
        .catch((err) => console.error(err));
    });
  }, []);

  // Sync Google Calendar whenever favorites change
  useEffect(() => {
    if (!calendarId) return;
    const sync = async () => {
      try {
        // Clear existing events
        const { result } = await ApiCalendar.listEvents({ calendarId });
        await Promise.all(
          (result.items || []).map((e) => ApiCalendar.deleteEvent(e.id, calendarId))
        );

        if (!favorites.length) {
          setEvents([]);
          return;
        }

        const matches = await fetch('/api/matches').then((r) => r.json());
        const relevant = matches.filter(
          (m) => favorites.includes(m.player1) || favorites.includes(m.player2)
        );

        const created = await Promise.all(
          relevant.map((m) => {
            const start = new Date(m.date).toISOString();
            const end = new Date(new Date(m.date).getTime() + 2 * 60 * 60 * 1000).toISOString();
            return ApiCalendar.createEvent(
              {
                summary: `${m.player1} vs ${m.player2}`,
                description: m.tournament?.name || '',
                start: { dateTime: start },
                end: { dateTime: end },
              },
              calendarId
            );
          })
        );
        setEvents(created.map((c) => c.result));
      } catch (err) {
        console.error(err);
      }
    };
    sync();
  }, [favorites, calendarId]);

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

