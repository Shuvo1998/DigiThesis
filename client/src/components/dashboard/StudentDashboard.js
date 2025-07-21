// client/src/components/dashboard/StudentDashboard.js
import React, { useContext, useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap, faFileAlt, faCheckCircle, faSpinner, faPlusCircle, faEye, faDownload,
    faExclamationCircle, faCheckDouble, faBan // Added faBan for rejected
} from '@fortawesome/free-solid-svg-icons'; // Ensure all icons are imported
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const StudentDashboard = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated && user && user.role === 'student') {
            fetchProposals();
        } else {
            setLoading(false); // If not student or not authenticated, no proposals to fetch
            if (!isAuthenticated) setError('Please log in to view your dashboard.');
        }
    }, [isAuthenticated, user]); // Depend on isAuthenticated and user to refetch

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            };
            // Ensure user.id is available before making the call
            if (user && user.id) {
                const res = await axios.get(`/api/theses/proposals/student/${user.id}`, config);
                setProposals(res.data);
            } else {
                setError('User ID not available.');
            }
            setLoading(false);
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.msg ? err.response.data.msg : 'Failed to fetch proposals.');
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
            case 'in_progress': return faSpinner;
            case 'completed': return faCheckDouble;
            default: return faSpinner; // pending_review
        }
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4 text-primary"><FontAwesomeIcon icon={faGraduationCap} className="me-2" /> Student Dashboard</h2>
            {user && <p className="lead">Welcome, **{user.username}**! Here you can manage your thesis proposals and submissions.</p>}

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-4">
                <Col md={4}>
                    <Card className="shadow-sm h-100 border-info">
                        <Card.Body>
                            <Card.Title className="text-center text-info"><FontAwesomeIcon icon={faFileAlt} /> Total Proposals</Card.Title>
                            <h1 className="text-center display-3 text-info">{proposals.length}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm h-100 border-success">
                        <Card.Body>
                            <Card.Title className="text-center text-success"><FontAwesomeIcon icon={faCheckCircle} /> Approved</Card.Title>
                            <h1 className="text-center display-3 text-success">{proposals.filter(p => p.status === 'approved').length}</h1>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm h-100 border-warning">
                        <Card.Body>
                            <Card.Title className="text-center text-warning"><FontAwesomeIcon icon={faSpinner} spin={loading} /> Pending Review</Card.Title>
                            <h1 className="text-center display-3 text-warning">{proposals.filter(p => p.status === 'pending_review').length}</h1>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">Your Proposals</Card.Header>
                        <Card.Body>
                            {loading ? (
                                <div className="text-center"><Spinner animation="border" role="status" /><p>Loading proposals...</p></div>
                            ) : proposals.length === 0 ? (
                                <p className="text-muted">No proposals submitted yet.</p>
                            ) : (
                                <ListGroup variant="flush">
                                    {proposals.map((proposal) => (
                                        <ListGroup.Item key={proposal._id} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-1">{proposal.title}</h5>
                                                <small className={`badge bg-${getStatusVariant(proposal.status)}`}>
                                                    <FontAwesomeIcon icon={getStatusIcon(proposal.status)} className="me-1" /> {proposal.status.replace(/_/g, ' ')}
                                                </small>
                                                {proposal.supervisor && (
                                                    <small className="ms-3 text-muted">Supervisor: {proposal.supervisor.username}</small>
                                                )}
                                                <p className="mb-0 text-muted mt-1">Submitted on: {new Date(proposal.submissionDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                {/* Ensure the path to the uploaded file is correct, e.g., http://localhost:5000/uploads/filename */}
                                                <Button variant="outline-info" size="sm" className="me-2"
                                                    onClick={() => window.open(`http://localhost:5000/${proposal.proposalFilePath.replace(/\\/g, '/')}`, '_blank')}>
                                                    <FontAwesomeIcon icon={faEye} /> View File
                                                </Button>
                                                {/* We'll add a proper view/edit page for proposals later */}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                            <div className="mt-3 text-center">
                                <Link to="/propose-thesis" className="btn btn-primary">
                                    <FontAwesomeIcon icon={faPlusCircle} className="me-2" /> Submit New Proposal
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StudentDashboard;