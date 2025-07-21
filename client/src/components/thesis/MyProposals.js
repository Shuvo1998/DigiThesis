// client/src/components/thesis/MyProposals.js
import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, ListGroup, ListGroupItem, Spinner, Alert, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faCalendarAlt, faHourglassHalf, faCheckCircle, faTimesCircle, faEye } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // For linking to the actual file

const MyProposals = () => {
    const { user } = useContext(AuthContext); // Get the logged-in user from context
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyProposals = async () => {
            if (!user || !user.id) {
                setError('User not authenticated or ID not found.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const config = {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                };
                // Fetch proposals for the logged-in student using their ID
                const res = await axios.get(`/api/theses/proposals/student/${user.id}`, config);
                setProposals(res.data);
            } catch (err) {
                console.error('Error fetching proposals:', err.response ? err.response.data : err.message);
                setError(err.response && err.response.data.msg ? err.response.data.msg : 'Failed to fetch proposals.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyProposals();
    }, [user]); // Re-run effect if user changes (e.g., after login)

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending_review':
                return <FontAwesomeIcon icon={faHourglassHalf} className="text-warning me-2" />;
            case 'approved':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2" />;
            case 'rejected':
                return <FontAwesomeIcon icon={faTimesCircle} className="text-danger me-2" />;
            default:
                return null;
        }
    };

    const formatStatus = (status) => {
        // Convert 'pending_review' to 'Pending Review' for display
        return status.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4 text-primary">
                <FontAwesomeIcon icon={faFileAlt} className="me-3" />My Thesis Proposals
            </h2>

            {loading && (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && proposals.length === 0 && !error && (
                <Alert variant="info" className="text-center">
                    You haven't submitted any thesis proposals yet. <Link to="/propose-thesis">Submit one now!</Link>
                </Alert>
            )}

            <div className="row g-4">
                {proposals.map(proposal => (
                    <div className="col-md-6 col-lg-4" key={proposal._id}>
                        <Card className="h-100 shadow-sm border-0">
                            <Card.Body>
                                <Card.Title className="text-truncate" title={proposal.title}>{proposal.title}</Card.Title>
                                <Card.Text className="text-muted small">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Submitted on: {formatDate(proposal.submissionDate)}
                                </Card.Text>
                                <ListGroup variant="flush">
                                    <ListGroupItem>
                                        <strong>Status:</strong> {getStatusIcon(proposal.status)} {formatStatus(proposal.status)}
                                    </ListGroupItem>
                                    {proposal.supervisor && (
                                        <ListGroupItem>
                                            <strong>Supervisor:</strong> {proposal.supervisor.username} ({proposal.supervisor.email})
                                        </ListGroupItem>
                                    )}
                                    <ListGroupItem>
                                        <strong>Keywords:</strong> {proposal.keywords.join(', ')}
                                    </ListGroupItem>
                                </ListGroup>
                                <Card.Text className="mt-3 text-secondary text-truncate" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                                    {proposal.abstract}
                                </Card.Text>
                                {proposal.proposalFilePath && (
                                    <Button
                                        variant="outline-primary"
                                        href={proposal.filePath} // Use the filePath provided by backend
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 w-100"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="me-2" /> View Proposal File
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default MyProposals;