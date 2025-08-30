import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import { logout } from '../store';

const Navibar = ({ isLoggedIn, handleClick }) => (
        <div>
                <Navbar bg="light" expand="lg" className="navbar">
                        <Container>
                                <Navbar.Brand href="/">Tennis Events</Navbar.Brand>
                                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                                <Navbar.Collapse id="basic-navbar-nav">
                                        <Nav className="me-auto">
                                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                                {isLoggedIn && (
                                                        <Nav.Link as={Link} to="/calendar">
                                                                Calendar
                                                        </Nav.Link>
                                                )}
                                                {isLoggedIn && (
                                                        <Nav.Link as={Link} to="/next">
                                                                What's Next?
                                                        </Nav.Link>
                                                )}
                                                {isLoggedIn ? (
                                                        <Nav.Link onClick={handleClick}>Logout</Nav.Link>
                                                ) : (
                                                        <>
                                                                <Nav.Link as={Link} to="/login">
                                                                        Login
                                                                </Nav.Link>
                                                                <Nav.Link as={Link} to="/signup">
                                                                        Sign Up
                                                                </Nav.Link>
                                                        </>
                                                )}
                                        </Nav>
                                </Navbar.Collapse>
                        </Container>
                </Navbar>
        </div>
);

const mapState = (state) => {
        return {
                isLoggedIn: !!state.auth.id,
        };
};

const mapDispatch = (dispatch) => {
        return {
                handleClick() {
                        dispatch(logout());
                },
        };
};

export default connect(mapState, mapDispatch)(Navibar);
