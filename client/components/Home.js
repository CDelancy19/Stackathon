import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

/**
 * COMPONENT
 */
export const Home = () => {
	return (
		<div className="home-page">
			<h3>Welcome to the Tennis Events Website!</h3>
			<p>
				The purpose of this site is to provide a google calendar of the listed
				ATP and WTA Tour events as they are schedled.
			</p>

			<h4>Technologies Used:</h4>

			<Accordion defaultActiveKey="0">
				<Accordion.Item eventKey="0">
					<Accordion.Header as={'h6'}>Google Api Calendar</Accordion.Header>
					<Accordion.Body>
						Used to add tournaments to the calendar
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="1">
					<Accordion.Header as={'h6'}>Nightmare.js</Accordion.Header>
					<Accordion.Body>
						Used to scrape the internet for the tournament information
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey="3">
					<Accordion.Header as={'h6'}>React-Bootstrap</Accordion.Header>
					<Accordion.Body>
						Used to make things look pretty
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

export default Home;
