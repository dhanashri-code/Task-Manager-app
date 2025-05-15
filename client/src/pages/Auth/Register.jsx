import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../services/authServices';
import { getErrorMessage } from '../../util/GetError';
import registerImg from '../../assets/registerImg.png';
import { message, Tooltip } from 'antd';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput,
} from 'mdb-react-ui-kit';

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);  // For toggling the password visibility

    const navigate = useNavigate();

    const validatePassword = (password) => {
        // Minimum 8 characters, one uppercase letter, one number, one special character
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        if (!validatePassword(password)) {
            const errorMsg = "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";

            message.error(errorMsg);
            return;
        }

        try {
            const data = { firstName, lastName, userName, password };
            const response = await AuthServices.registerUser(data);
            message.success("You're Registered Successfully");
            navigate('/login');
        } catch (error) {
            console.error(error);
            message.error(getErrorMessage(error));
        }
    };

    return (
        <MDBContainer fluid className='bg-dark'>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol>
                    <MDBCard className='my-4'>
                        <MDBRow className='g-6'>

                            <MDBCol md='6' className="d-none d-md-block" style={{ marginTop: '40px' }}>
                                <MDBCardImage src={registerImg} alt="Sample photo" className="rounded-start" fluid />
                            </MDBCol>

                            <MDBCol md='5'>
                                <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                                    <Form onSubmit={handleSubmit}>
                                        <h3 className="mb-8 text-uppercase fw-bold" style={{ marginTop: '40px' }}>
                                            Registration form
                                        </h3>

                                        <MDBRow>
                                            <MDBCol md='6'>
                                                <MDBInput
                                                    wrapperClass='mb-4'
                                                    label='First Name'
                                                    size='lg'
                                                    type='text'
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                />
                                            </MDBCol>

                                            <MDBCol md='6'>
                                                <MDBInput
                                                    wrapperClass='mb-4'
                                                    label='Last Name'
                                                    size='lg'
                                                    type='text'
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                />
                                            </MDBCol>
                                        </MDBRow>

                                        <MDBInput
                                            wrapperClass='mb-4'
                                            label='UserName'
                                            size='lg'
                                            type='text'
                                            value={userName}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />

                                        <Tooltip title="Must be at least 8 characters, include an uppercase letter, a number, and a special character.">
                                            <div className="position-relative">
                                                <MDBInput
                                                    wrapperClass='mb-1'
                                                    label='Password'
                                                    size='lg'
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <i
                                                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
                                                    style={{ top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                                    onClick={() => setShowPassword(!showPassword)}  // Toggle password visibility
                                                />
                                            </div>
                                        </Tooltip>

                                        <div className="d-flex justify-content-center pt-3">
                                            <MDBBtn
                                                className='ms-2'
                                                color='dark'
                                                size='lg'
                                                type='submit'
                                            >
                                                Register
                                            </MDBBtn>
                                        </div>

                                        <div className="d-flex justify-content-center pt-4">
                                            <p className="mb-5 pb-lg-2">
                                                Already have an account? <Link to="/login" style={{ color: 'blue', fontSize: "15px" }}>Login here</Link>
                                            </p>
                                        </div>
                                    </Form>
                                </MDBCardBody>
                            </MDBCol>
                        </MDBRow>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
}
