// client/src/components/auth/Login.js
import React, { useState, useContext } from 'react';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext'; // Correct path to AuthContext

const Login = () => {
    const { setIsAuthenticated, setUser } = useContext(AuthContext); // Access AuthContext
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setLoading(true); // Set loading to true
        try {
            const res = await axios.post('/api/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', res.data.token); // Store the JWT token
            setIsAuthenticated(true); // Update auth state via context
            setUser(res.data.user); // Set user data in context

            // Redirect based on user role
            navigate(`/${res.data.user.role}-dashboard`);

        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.msg ? err.response.data.msg : 'Login failed. Invalid credentials.');
        } finally {
            setLoading(false); // Reset loading
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="p-4 shadow-lg" style={{ width: '400px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary">Login to DigiThesis</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                        {loading ? 'Logging In...' : 'Login'}
                    </Button>
                </Form>
                <div className="mt-4 text-center">
                    Don't have an account? <Link to="/register" className="text-decoration-none">Register Here</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Login;