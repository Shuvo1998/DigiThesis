// client/src/components/layout/Header.js
import React, { useContext } from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // For React Router with Bootstrap Nav.Link
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faSignInAlt, faUserPlus, faHome, faTachometerAlt, faGraduationCap, faChalkboardTeacher, faUserShield, faFileAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    // Build dropdown items conditionally
    const dropdownItems = [];

    if (user) {
        if (user.role === 'student') {
            dropdownItems.push(
                <LinkContainer to="/student-dashboard" key="student-dash">
                    <NavDropdown.Item><FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Student Dashboard</NavDropdown.Item>
                </LinkContainer>,
                <LinkContainer to="/propose-thesis" key="propose-thesis">
                    <NavDropdown.Item><FontAwesomeIcon icon={faPlusCircle} className="me-2" /> Propose Thesis</NavDropdown.Item>
                </LinkContainer>,
                <LinkContainer to="/my-proposals" key="my-proposals">
                    <NavDropdown.Item><FontAwesomeIcon icon={faFileAlt} className="me-2" /> My Proposals</NavDropdown.Item>
                </LinkContainer>,
                <NavDropdown.Divider key="student-divider" />
            );
        } else if (user.role === 'supervisor') {
            dropdownItems.push(
                <LinkContainer to="/supervisor-dashboard" key="supervisor-dash">
                    <NavDropdown.Item><FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Supervisor Dashboard</NavDropdown.Item>
                </LinkContainer>,
                <NavDropdown.Divider key="supervisor-divider" />
            );
        } else if (user.role === 'admin') {
            dropdownItems.push(
                <LinkContainer to="/admin-dashboard" key="admin-dash">
                    <NavDropdown.Item><FontAwesomeIcon icon={faTachometerAlt} className="me-2" /> Admin Dashboard</NavDropdown.Item>
                </LinkContainer>,
                <NavDropdown.Divider key="admin-divider" />
            );
        }

        // Always add logout for authenticated users
        dropdownItems.push(
            <NavDropdown.Item onClick={logout} className="text-danger" key="logout">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
            </NavDropdown.Item>
        );
    }

    const authLinks = (
        <NavDropdown
            title={<span><FontAwesomeIcon icon={faUserCircle} className="me-2" />{user ? user.username : 'Profile'}</span>}
            id="basic-nav-dropdown"
            align="end" // Align dropdown menu to the right
        >
            {dropdownItems}
        </NavDropdown>
    );

    const guestLinks = (
        <>
            <LinkContainer to="/register">
                <Nav.Link className="me-2">
                    <Button variant="outline-success"><FontAwesomeIcon icon={faUserPlus} className="me-2" /> Register</Button>
                </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
                <Nav.Link>
                    <Button variant="primary"><FontAwesomeIcon icon={faSignInAlt} className="me-2" /> Login</Button>
                </Nav.Link>
            </LinkContainer>
        </>
    );

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <FontAwesomeIcon icon={faGraduationCap} className="me-2" /> DigiThesis
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <LinkContainer to="/">
                            <Nav.Link><FontAwesomeIcon icon={faHome} className="me-2" /> Home</Nav.Link>
                        </LinkContainer>
                        {user ? authLinks : guestLinks}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;