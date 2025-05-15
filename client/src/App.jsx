import { Routes, Route } from 'react-router-dom';
import "antd/dist/reset.css";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ToDoList from './pages/ToDo/ToDoList';
import DashBoard from './pages/ToDo/DashBoard';
import Chatbot from './pages/ToDo/Chatbot';
import NotificationsPage from "./pages/ToDo/NotificationsPage"; // Import notifications page component


function App() {

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/to-do-list" element={<ToDoList />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>

    </>
  );
}

export default App;
