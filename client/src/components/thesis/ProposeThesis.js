// client/src/components/thesis/ProposeThesis.js
import React, { useState, useContext } from 'react';
import { Container, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faHeading, faTextHeight, faTags, faUpload } from '@fortawesome/free-solid-svg-icons';

const ProposeThesis = () => {
    const { user } = useContext(AuthContext); // Access user from AuthContext
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        keywords: '',
    });
    const [proposalFile, setProposalFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { title, abstract, keywords } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onFileChange = (e) => {
        // Only allow PDF and DOCX files
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword')) {
            setProposalFile(file);
            setError(''); // Clear any previous file-related errors
        } else {
            setProposalFile(null); // Reset file if invalid
            setError('Only PDF and DOCX/DOC files are allowed.');
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!proposalFile) {
            setError('Please upload a thesis proposal file (PDF or DOCX).');
            return;
        }

        if (!title || !abstract || !keywords) {
            setError('Please fill in all text fields (Title, Abstract, Keywords).');
            return;
        }

        const data = new FormData();
        data.append('title', title);
        data.append('abstract', abstract);
        // Split keywords by comma, trim whitespace, and filter out empty strings
        data.append('keywords', JSON.stringify(keywords.split(',').map(kw => kw.trim()).filter(kw => kw.length > 0)));
        data.append('proposalFile', proposalFile);

        try {
            setLoading(true);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            };

            const res = await axios.post('/api/theses/proposals', data, config);
            setMessage(res.data.msg);
            // Clear form after successful submission
            setFormData({ title: '', abstract: '', keywords: '' });
            setProposalFile(null); // Clear file input state
            // Optionally reset the file input element itself (if needed for visual feedback)
            e.target.reset(); // Resets the form

            setTimeout(() => {
                navigate('/student-dashboard'); // Redirect after a short delay
            }, 2000);

        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.msg ? err.response.data.msg : 'Failed to submit proposal. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="p-4 shadow-lg" style={{ width: '600px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary">
                    <FontAwesomeIcon icon={faFileAlt} className="me-2" /> Submit Thesis Proposal
                </h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Thesis Title</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faHeading} /></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Enter thesis title"
                                name="title"
                                value={title}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="abstract">
                        <Form.Label>Abstract</Form.Label>
                        <InputGroup>
                            <InputGroup.Text className="align-self-start mt-2"><FontAwesomeIcon icon={faTextHeight} /></InputGroup.Text>
                            <Form.Control
                                as="textarea"
                                rows={5}
                                placeholder="Write your thesis abstract (min 50 words)"
                                name="abstract"
                                value={abstract}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="keywords">
                        <Form.Label>Keywords</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faTags} /></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Enter keywords, comma separated (e.g., AI, Machine Learning, Education)"
                                name="keywords"
                                value={keywords}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="proposalFile">
                        <Form.Label>Upload Proposal Document (PDF or DOCX/DOC, Max 10MB)</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faUpload} /></InputGroup.Text>
                            <Form.Control
                                type="file"
                                name="proposalFile"
                                onChange={onFileChange}
                                accept=".pdf, .docx, .doc" // Specify accepted file types
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Proposal'}
                    </Button>
                </Form>
                {user && <p className="mt-3 text-center text-muted">Submitting as: **{user.username}** ({user.role})</p>}
            </Card>
        </Container>
    );
};

export default ProposeThesis;