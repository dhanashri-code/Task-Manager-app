import axios from 'axios';

const SERVER_URL = "http://localhost:5000"; 

const registerUser = (data) => {
    return axios.post(`${SERVER_URL}/register`, data);
};

const loginUser = (data) => {
    return axios.post(`${SERVER_URL}/login`, data);
};

const AuthServices = {
    registerUser,
    loginUser
};

export default AuthServices;
