// client/src/components/NotFound.js
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFound = () => {
    return (
        <Container className="mt-5 text-center">
            <h1 className="display-1 text-danger">
                <FontAwesomeIcon icon={faExclamationTriangle} className="me-3" />404
            </h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead">The page you are looking for does not exist or has been moved.</p>
            <Link to="/" className="btn btn-primary mt-3">
                <FontAwesomeIcon icon={faHome} className="me-2" /> Go to Home
            </Link>
        </Container>
    );
};

export default NotFound;