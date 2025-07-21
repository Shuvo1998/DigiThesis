// client/src/components/auth/Register.js
import React, { useState, useContext } from 'react';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faUserGraduate, faChalkboardTeacher as faChalkboardTeacherSolid } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext'; // Correct path to AuthContext

const Register = () => {
    const { setIsAuthenticated, setUser } = useContext(AuthContext); // Access AuthContext
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added loading state
    const navigate = useNavigate();

    const { username, email, password, confirmPassword, role } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setMessage(''); // Clear previous messages
        setLoading(true); // Set loading to true

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post('/api/auth/register', {
                username,
                email,
                password,
                role,
            });
            setMessage('Registration successful! Redirecting to login...'); // Changed message

            // Directly log in the user after successful registration for a smoother UX
            localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);
            setUser(res.data.user);

            setTimeout(() => {
                navigate(`/${res.data.user.role}-dashboard`); // Redirect to appropriate dashboard
            }, 1500); // Give user a moment to read success message

        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            setError(err.response && err.response.data.msg ? err.response.data.msg : 'Registration failed. Please try again.');
        } finally {
            setLoading(false); // Reset loading
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Card className="p-4 shadow-lg" style={{ width: '450px', borderRadius: '15px' }}>
                <h2 className="text-center mb-4 text-primary">Create Your Account</h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faUser} /></InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Choose a username"
                                name="username"
                                value={username}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faEnvelope} /></InputGroup.Text>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="Create a password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><FontAwesomeIcon icon={faLock} /></InputGroup.Text>
                            <Form.Control
                                type="password"
                                placeholder="Confirm your password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                required
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="role">
                        <Form.Label>Register As</Form.Label>
                        <InputGroup>
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={role === 'student' ? faUserGraduate : faChalkboardTeacherSolid} />
                            </InputGroup.Text>
                            <Form.Select name="role" value={role} onChange={onChange}>
                                <option value="student">Student</option>
                                <option value="supervisor">Supervisor</option>
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </Form>
                <div className="mt-4 text-center">
                    Already have an account? <Link to="/login" className="text-decoration-none">Login Here</Link>
                </div>
            </Card>
        </Container>
    );
};

export default Register;