import React from 'react'
import Accordion from 'react-bootstrap/Accordion';

export default function Next() {
  return (
    <div className="home-page">
			<h3>What's Left to be Implemented?</h3>
			<p>
				I didn't get to add as many features as I wanted to so here is a list
			</p>

			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header as={'h6'}>Heroku Deployment</Accordion.Header>
					<Accordion.Body>
						I want to deploy my site to heroku and have it published for personal use
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header as={'h6'}>Auto Updates</Accordion.Header>
					<Accordion.Body>
						Right now, in order to update the calendar I have to manually run the program. I want to create a script that will run the code once a week to check for updates and add new tournaments as they are added to the calendar.
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="2">
					<Accordion.Header as={'h6'}>Text Notifications</Accordion.Header>
					<Accordion.Body>
						I want to create a form that people can input there phone number and be sent texts when an tournament is going to start
					</Accordion.Body>
				</Accordion.Item>
        <Accordion.Item eventKey="3">
					<Accordion.Header as={'h6'}>More Specific Calendar Events</Accordion.Header>
					<Accordion.Body>
						I want to create more specific calendar events that instaed of being an event per tournament it would be an event per match. The matches would be linked to the players and then you would be able to subscribe to the calendars of your favorite players matches.
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
  )
}
