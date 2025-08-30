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

        if (!favorites.length) return;

        const matches = await fetch('/api/matches').then((r) => r.json());
        const relevant = matches.filter(
          (m) => favorites.includes(m.player1) || favorites.includes(m.player2)
        );

        await Promise.all(
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
      } catch (err) {
        console.error(err);
      }
    };
    sync();
  }, [favorites, calendarId]);

  if (!calendarId) return <div className="calendar">Loading...</div>;

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const src = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
    calendarId
  )}&ctz=${encodeURIComponent(timeZone)}`;

  return (
    <div className="calendar">
      <iframe
        src={src}
        style={{ border: 0 }}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default Calendar;

