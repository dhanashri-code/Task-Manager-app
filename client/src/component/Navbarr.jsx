import React, { useState, useEffect } from 'react';
import { Modal, message, Button, Tooltip, Divider, Badge } from 'antd';
import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../util/GetUser';
import { BellOutlined, HomeOutlined, UserOutlined, ProfileOutlined, DashboardOutlined, LogoutOutlined } from "@ant-design/icons";
import './navbar.css';
import ToDoServices from "../services/ToDoServices";
import navLogo from '../assets/navlogo.jpg';
import menuLogo from '../assets/menulogo.png';
import NotificationService from "../services/NotificationService";

export default function Navbarr({ active }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = getUserDetails();
    if (userDetails?.userId) {
      setUser(userDetails); // ✅ Set user here

      const fetchUnreadCount = async () => {
        try {
          const res = await NotificationService.getUnreadCount(userDetails.userId);
          setHasUnread(res.data.count > 0);
        } catch (err) {
          console.error("Fetch unread count failed:", err);
        }
      };
      fetchUnreadCount();
    }
  }, []);

  const handleLogout = () => {
    message.success("User Logged out");
    localStorage.removeItem("ToDoAppUser");
    navigate('/login');
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: 'Are you sure you want to delete your account?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        const userDetails = getUserDetails();
        if (!userDetails?.userId) {
          message.error("User ID not found");
          return;
        }

        try {
          await ToDoServices.deleteUser(userDetails.userId);
          localStorage.removeItem('token');
          localStorage.removeItem("ToDoAppUser");
          sessionStorage.clear();
          document.cookie.split(";").forEach((cookie) => { 
            document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
          message.success("User Account Deleted Successfully");
          navigate('/');
        } catch (err) {
          message.error("Error deleting user. Please try again later.");
        }
      },
    });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary px-3">
        <Container fluid>
          <Navbar.Brand href="#"><img src={navLogo} style={{ width: 220 }} alt="profile" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="ms-auto align-items-center" style={{ fontSize: "17px", fontWeight: "bold" }} navbarScroll>
              {!user ? (
                <>
                  <Nav.Link as={NavLink} to="/">
                    <HomeOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
                    Home
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                  <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                </>
              ) : null}
            </Nav>
          </Navbar.Collapse>
          {user && (
            <Tooltip title="Menu">
              <img src={menuLogo} style={{ width: 40 }} onClick={() => setShowSidebar(true)} alt="profile" />
            </Tooltip>
          )}
        </Container>
      </Navbar>

      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        placement="end"
        className="custom-sidebar"
      >
        <Offcanvas.Header closeButton style={{ color: 'black' }}>
          <Offcanvas.Title style={{ fontSize: "24px", fontWeight: "bold", marginTop: "20px" }}>
            <UserOutlined style={{ fontSize: "24px", marginLeft: "14px", marginRight: "8px" }} />
            {user?.firstName ? `Hello, ${user.firstName} ${user.lastName}` : user?.userName}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Divider />
          <Nav className="flex-column">
            {user && (
              <>
                <Nav.Link as={NavLink} to="/">
                  <HomeOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
                  Home
                </Nav.Link>
                <Nav.Link as={NavLink} to="/to-do-list" className={active === 'myTask' ? 'activeNav' : ''}>
                  <ProfileOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
                  My Task
                </Nav.Link>
              </>
            )}
            <Nav.Link as={NavLink} to="/dashboard">
              <DashboardOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/notifications">
              <Badge dot={hasUnread}>
                <BellOutlined style={{ fontSize: '24px', marginRight: "8px", cursor: 'pointer', color: "blue" }} />
                <span style={{ color: "blue", fontSize: '17px' }}>Notifications</span>
              </Badge>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/chatbot">
              <ProfileOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              ChatBot
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <LogoutOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
              Logout
            </Nav.Link>
            <Divider />
            <Button type='danger' onClick={handleDelete}>Delete Account</Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
