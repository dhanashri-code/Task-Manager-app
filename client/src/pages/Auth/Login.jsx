import Form from 'react-bootstrap/Form'; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthServices from '../../services/authServices';
import { message } from 'antd';
import { getErrorMessage } from '../../util/GetError';
import loginImg from '../../assets/loginImg.jpg';

import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput
} from 'mdb-react-ui-kit';

export default function Login() {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            console.log("Logging in...");
            let data = { userName, password };

            const response = await AuthServices.loginUser(data);
            if (!response || !response.data) {
                throw new Error("Invalid login response");
            }

            console.table(response.data);

            // Ensure proper local storage handling
            localStorage.setItem("ToDoAppUser", JSON.stringify(response.data));
            message.success("Logged in Successfully");
            navigate('/to-do-list');

        } catch (error) {
            console.error("Login error:", error);
            message.error(getErrorMessage(error) || "Login failed. Please try again.");
        }
    };

    return (
        <MDBContainer fluid className='bg-dark'>
            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol>
                    <MDBCard className='my-4'>
                        <MDBRow className='g-6'>
                            <MDBCol md='6' className="d-none d-md-block" style={{ marginTop: '70px' }}>
                                <MDBCardImage src={loginImg} alt="Sample photo" className="rounded-start" fluid />
                            </MDBCol>

                            <MDBCol md='6'>
                                <MDBCardBody className='text-black d-flex flex-column justify-content-center'>
                                    <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                                        <h3 className="mb-8 text-uppercase fw-bold" style={{ marginTop: '70px' }}>Login form</h3>

                                        <MDBInput 
                                            wrapperClass='mb-4' 
                                            label='UserName' 
                                            id='formControlLg' 
                                            name='userName' 
                                            type='text' 
                                            size="lg" 
                                            value={userName} 
                                            onChange={(e) => setUsername(e.target.value)} 
                                        />

                                        <MDBInput 
                                            wrapperClass='mb-4' 
                                            label="Password" 
                                            id='formControlLp' 
                                            name='password'  // ✅ Fixed typo
                                            type='password' 
                                            size="lg" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                        />

                                        <div className="d-flex justify-content-center pt-3">
                                            <MDBBtn 
                                                className="mb-4 px-5" 
                                                color='dark' 
                                                size='lg' 
                                                type="submit"  // ✅ Changed from `onClick` to `type="submit"`
                                                disabled={!userName || !password}
                                            >
                                                Login
                                            </MDBBtn>
                                        </div>

                                        <div className="d-flex justify-content-center pt-3">
                                            <p className="mb-5 pb-lg-2">Don't have an account? <Link to="/register">Register here</Link></p>
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
};
