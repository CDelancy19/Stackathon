import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Navibar = () => (
	<div>
		<Navbar bg="light" expand="lg">
			<Container>
				<Navbar.Brand href="/">Tennis Events</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link as={Link} to="/">Home</Nav.Link>
						<Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
						<Nav.Link as={Link} to="/next">What's Next?</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	</div>
);

export default Navibar;
