import axios from 'axios';
import { getUserDetails } from '../util/GetUser'; // Ensure correct import

const SERVER_URL = "https://task-manager-app-yta0.onrender.com";

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

const createToDo = (data) => {
    return axios.post(`${SERVER_URL}/create-to-do`, data, authHeaders());
};

const getAllToDo = (userId) => {
    return axios.get(`${SERVER_URL}/get-all-to-do/${userId}`, authHeaders());
};

/*const updateToDo = (id, data) => {
    return axios.patch(`${SERVER_URL}/update-to-do/${id}`, data, authHeaders() , {
        isCompleted: true,
        completedOn: new Date().toISOString()});

};*/

const updateToDo = (id, data) => {
    // If the update includes changing status to completed, set completedOn
    const updatedData = {
        ...data, // Include existing data
        ...(data.isCompleted && { completedOn: new Date().toISOString() }) // Set completedOn only if task is marked complete
    };

    return axios.patch(
        `${SERVER_URL}/update-to-do/${id}`,
        updatedData,
        authHeaders()  // Ensure headers are passed correctly
    );
};


const deleteToDo = (id) => {
    return axios.delete(`${SERVER_URL}/delete-to-do/${id}`, authHeaders());
};

const dashBoard = (userId) => {
    if (!userId) {
        console.error("Error: userId is missing in dashboard API call");
        return Promise.reject(new Error("User ID is required"));
    }

    return axios.get(`${SERVER_URL}/dashboard/${userId}`, authHeaders());
};

const deleteUser = async (userId) => {
    return await axios.delete(`${SERVER_URL}/delete-account/${userId}`, authHeaders());
};

// API call to get chatbot response based on the current step
const chatbot = async (step, userInput = '') => {
    try {
      const response = await axios.post(`${SERVER_URL}/chatbot`, { step, userInput }, authHeaders());
      return response.data; // Assume the response contains the bot's reply
    } catch (err) {
      console.error("Error fetching chatbot response:", err);
      throw err;
    }
  };
  
  
  
const ToDoServices = {
    getAllToDo,
    createToDo,
    updateToDo,
    deleteToDo,
    dashBoard,
    deleteUser,
    chatbot
};

export default ToDoServices;
