import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';

/**
 * COMPONENT
 */
export const Home = () => {
  const [info, setInfo] = useState({ tournaments: [], atpTop: [], wtaTop: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/tennis/home');
        const data = await res.json();
        setInfo(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div className="home-page">
      <h3>Welcome to the Tennis Events Website!</h3>
      <p>
        The purpose of this site is to provide a google calendar of the listed ATP and WTA Tour events as they are schedled.
      </p>

      <section>
        <h4>Currently Playing Tournaments</h4>
        <ul>
          {info.tournaments.map((t) => (
            <li key={t.id || t.name}>{t.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4>ATP Top 10</h4>
        <ol>
          {info.atpTop.map((p) => (
            <li key={p.id || p.name}>{p.name || p.full_name}</li>
          ))}
        </ol>
      </section>

      <section>
        <h4>WTA Top 10</h4>
        <ol>
          {info.wtaTop.map((p) => (
            <li key={p.id || p.name}>{p.name || p.full_name}</li>
          ))}
        </ol>
      </section>

      <h4>Technologies Used:</h4>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header as={'h6'}>Google Calendar API</Accordion.Header>
          <Accordion.Body>Adds tournaments directly to your Google Calendar</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header as={'h6'}>Nightmare.js</Accordion.Header>
          <Accordion.Body>Scrapes tournament information from the web</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header as={'h6'}>SQLite & Sequelize</Accordion.Header>
          <Accordion.Body>Stores scraped data using a lightweight SQL database</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header as={'h6'}>React-Bootstrap</Accordion.Header>
          <Accordion.Body>Provides responsive UI components</Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header as={'h6'}>Netlify Identity & Neon</Accordion.Header>
          <Accordion.Body>Serverless functions use Netlify Identity for auth and Neon for persistent storage</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Home;
