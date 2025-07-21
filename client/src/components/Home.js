// client/src/components/Home.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
    return (
        <Container className="text-center py-5 bg-light rounded-3 shadow-sm mt-4">
            <h1 className="display-4 fw-bold text-primary mb-3">
                Welcome to DigiThesis!
            </h1>
            <p className="lead text-muted mb-4">
                Your AI-powered Thesis Management System. Streamline your academic journey with smart tools.
            </p>
            <div className="d-grid gap-2 col-md-6 mx-auto">
                <LinkContainer to="/register">
                    <Button variant="primary" size="lg">
                        <FontAwesomeIcon icon={faRocket} className="me-2" /> Get Started
                    </Button>
                </LinkContainer>
                <LinkContainer to="/login">
                    <Button variant="outline-secondary" size="lg">
                        Already have an account? Login
                    </Button>
                </LinkContainer>
            </div>
        </Container>
    );
};

export default Home;