import axios from 'axios';
import { getUserDetails } from '../util/GetUser'; // Ensure correct import

const BASE_URL = "https://task-manager-app-yta0.onrender.com";
// Your backend API

const authHeaders = () => {
    console.log("User Details:", getUserDetails());

    const userToken = getUserDetails()?.token;
    console.log("authheader", userToken);
    return {
        headers: {
            'Authorization': userToken
        } // Ensure correct format
    };
};

const createNotification = (data) => 
 axios.post(`${BASE_URL}/createNoti`, data, authHeaders());


const getUserNotifications = (userId) => {
    return axios.get(`${BASE_URL}/user/${userId}`, authHeaders());
}

// services/NotificationService.js
const markAsRead = (id) => axios.put(`${BASE_URL}/mark-read/${id}`, {}, authHeaders());

const getUnreadCount = (userId) => axios.get(`${BASE_URL}/user/${userId}/unread-count`, authHeaders());

const checkDeadlines = () => axios.get(`${BASE_URL}/check-deadlines`, authHeaders());

const deleteNotification = (notificationId) =>
    axios.delete(`${BASE_URL}/delete/${notificationId}`, authHeaders());
  
  const deleteAllNotifications = (userId) =>
    axios.delete(`${BASE_URL}/deleteAll/${userId}`, authHeaders());
  

export default {
    createNotification,
    getUserNotifications,
    markAsRead,
    getUnreadCount,
    checkDeadlines,
    deleteNotification,
    deleteAllNotifications,
};
