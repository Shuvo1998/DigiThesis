// client/src/components/dashboard/AdminDashboard.js
import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserShield, faUsers, faFileInvoice, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext'; // <-- CORRECTED IMPORT SYNTAX

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-primary"><FontAwesomeIcon icon={faUserShield} className="me-2" /> Admin Dashboard</h2>
            {user && <p className="lead">Welcome, **{user.username}**! Here you have a complete overview of the system.</p>}
            <Row className="g-4">
                <Col md={4}>
                    <Card className="shadow-sm h-100 border-primary">
                        <Card.Body>
                            <Card.Title className="text-center text-primary"><FontAwesomeIcon icon={faUsers} /> Total Users</Card.Title>
                            <h1 className="text-center display-3 text-primary">150</h1> {/* Placeholder - fetch from API later */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm h-100 border-info">
                        <Card.Body>
                            <Card.Title className="text-center text-info"><FontAwesomeIcon icon={faFileInvoice} /> Total Theses</Card.Title>
                            <h1 className="text-center display-3 text-info">75</h1> {/* Placeholder - fetch from API later */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm h-100 border-dark">
                        <Card.Body>
                            <Card.Title className="text-center text-dark"><FontAwesomeIcon icon={faChartBar} /> System Analytics</Card.Title>
                            <h1 className="text-center display-3 text-dark">📈</h1> {/* Placeholder */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">System Overview</Card.Header>
                        <Card.Body>
                            <p className="text-muted">Detailed user management, thesis archiving, and report generation will be available here.</p>
                            {/* Add links to user management, thesis lists for admin */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;