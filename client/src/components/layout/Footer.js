// client/src/components/layout/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 mt-auto">
            <Container>
                <Row className="text-center text-md-start">
                    <Col md={4} className="mb-3">
                        <h5 className="text-white">DigiThesis</h5>
                        <p className="text-muted">An AI-powered Thesis Management System to streamline your academic journey.</p>
                    </Col>
                    <Col md={4} className="mb-3">
                        <h5 className="text-white">Quick Links</h5>
                        <ul className="list-unstyled text-muted">
                            <li><a href="/" className="text-decoration-none text-muted">Home</a></li>
                            <li><a href="/login" className="text-decoration-none text-muted">Login</a></li>
                            <li><a href="/register" className="text-decoration-none text-muted">Register</a></li>
                            {/* Add more links as features develop */}
                        </ul>
                    </Col>
                    <Col md={4} className="mb-3">
                        <h5 className="text-white">Contact Us</h5>
                        <ul className="list-unstyled text-muted">
                            <li><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" /> Pabna, Bangladesh</li>
                            <li><FontAwesomeIcon icon={faEnvelope} className="me-2" /> info@digithesis.com</li>
                            <li><FontAwesomeIcon icon={faPhone} className="me-2" /> +880 123 456789</li>
                        </ul>
                        <div className="mt-3">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3"><FontAwesomeIcon icon={faFacebook} size="lg" /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white me-3"><FontAwesomeIcon icon={faTwitter} size="lg" /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white me-3"><FontAwesomeIcon icon={faLinkedin} size="lg" /></a>
                            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-white"><FontAwesomeIcon icon={faGithub} size="lg" /></a>
                        </div>
                    </Col>
                </Row>
                <hr className="bg-secondary" />
                <Row>
                    <Col className="text-center text-muted">
                        &copy; {new Date().getFullYear()} DigiThesis. All Rights Reserved.
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;