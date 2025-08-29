import React from 'react'
import Accordion from 'react-bootstrap/Accordion';

export default function Next() {
  return (
    <div className="home-page">
                        <h3>Future Enhancements</h3>
                        <p>
                                Planned features to improve the experience
                        </p>

                        <Accordion defaultActiveKey="0">
                                <Accordion.Item eventKey="0">
                                        <Accordion.Header as={'h6'}>Automated Weekly Updates</Accordion.Header>
                                        <Accordion.Body>
                                                Schedule the scraper to run automatically so new tournaments appear without manual intervention.
                                        </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="1">
                                        <Accordion.Header as={'h6'}>Notification System</Accordion.Header>
                                        <Accordion.Body>
                                                Allow fans to opt in to email or text reminders before tournaments begin.
                                        </Accordion.Body>
                                </Accordion.Item>
                                <Accordion.Item eventKey="2">
                                        <Accordion.Header as={'h6'}>Player Match Calendars</Accordion.Header>
                                        <Accordion.Body>
                                                Generate match-level events and let users subscribe to calendars for their favorite players.
                                        </Accordion.Body>
                                </Accordion.Item>
                        </Accordion>
                </div>
  )
}
