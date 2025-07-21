// client/src/components/dashboard/SupervisorDashboard.js
import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, ListGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faEnvelopeOpenText, faUserCheck, faEye, faDownload, faFileAlt, faCheckCircle, faSpinner as faSpinnerSolid, faBan } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const SupervisorDashboard = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [pendingProposals, setPendingProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated && user && user.role === 'supervisor') {
            fetchPendingProposals();
        } else {
            setLoading(false);
            if (!isAuthenticated) setError('Please log in to view your dashboard.');
        }
    }, [isAuthenticated, user]);

    const fetchPendingProposals = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            const res = await axios.get('/api/theses/proposals/pending-supervisor', config);
            setPendingProposals(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.msg ? err.response.data.msg : 'Failed to fetch pending proposals.');
            setLoading(false);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            case 'in_progress': return 'primary';
            case 'completed': return 'info';
            default: return 'warning'; // pending_review
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return faCheckCircle;
            case 'rejected': return faBan;
            case 'in_progress': return faSpinnerSolid;
            case 'completed': return faCheckCircle; // Or faCheckDouble if preferred
            default: return faSpinnerSolid; // pending_review
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-primary"><FontAwesomeIcon icon={faChalkboardTeacher} className="me-2" /> Supervisor Dashboard</h2>
            {user && <p className="lead">Welcome, **{user.username}**! Here you can review student proposals and provide feedback.</p>}

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-4">
                <Col md={6}>
                    <Card className="shadow-sm h-100 border-info">
                        <Card.Body>
                            <Card.Title className="text-center text-info"><FontAwesomeIcon icon={faEnvelopeOpenText} /> Pending Reviews</Card.Title>
                            <h1 className="text-center display-3 text-info">{pendingProposals.length}</h1>
                            <p className="text-center text-muted">New proposals awaiting your review.</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm h-100 border-success">
                        <Card.Body>
                            <Card.Title className="text-center text-success"><FontAwesomeIcon icon={faUserCheck} /> Supervised Theses</Card.Title>
                            <h1 className="text-center display-3 text-success">
                                {/* This would require fetching all proposals where supervisor matches user.id and status is approved/in_progress/completed */}
                                {/* For now, a placeholder */}
                                5
                            </h1>
                            <p className="text-center text-muted">Number of theses you are currently supervising.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">Proposals Awaiting Your Review</Card.Header>
                        <Card.Body>
                            {loading ? (
                                <div className="text-center"><Spinner animation="border" role="status" /><p>Loading proposals...</p></div>
                            ) : pendingProposals.length === 0 ? (
                                <p className="text-muted">No pending proposals at the moment.</p>
                            ) : (
                                <ListGroup variant="flush">
                                    {pendingProposals.map((proposal) => (
                                        <ListGroup.Item key={proposal._id} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-1">{proposal.title}</h5>
                                                <p className="mb-0 text-muted">Submitted by: {proposal.student.username} ({proposal.student.email})</p>
                                                <small className={`badge bg-${getStatusVariant(proposal.status)} mt-1`}>
                                                    <FontAwesomeIcon icon={getStatusIcon(proposal.status)} className="me-1" /> {proposal.status.replace(/_/g, ' ')}
                                                </small>
                                                <p className="mb-0 text-muted mt-1">Submitted on: {new Date(proposal.submissionDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <Button variant="outline-info" size="sm" className="me-2"
                                                    onClick={() => window.open(`http://localhost:5000/${proposal.proposalFilePath.replace(/\\/g, '/')}`, '_blank')}>
                                                    <FontAwesomeIcon icon={faEye} /> View File
                                                </Button>
                                                {/* Add buttons for Approve/Reject/View Details - we will implement these in next steps */}
                                                <Button variant="outline-primary" size="sm">Review</Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default SupervisorDashboard;