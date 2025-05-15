import { useEffect, useState } from "react";
import NotificationService from "../../services/NotificationService";
import { getUserDetails } from "../../util/GetUser"; // Your helper to get logged-in user
import Navbarr from "../../component/Navbarr";
import { message } from "antd";
import React from 'react';
import { Button, Card, List, Typography, Empty, Popconfirm, Space, Tag } from 'antd';
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { Text } = Typography;

  const fetchNotifications = async () => {
    try {
      const { userId } = getUserDetails();
      const response = await NotificationService.getUserNotifications(userId);
      console.log("notification msg", response);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);
      fetchNotifications(); // refresh after update
      message.success("Notification marked as read.");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      message.error("Failed to mark notification as read.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const { userId } = getUserDetails();
      await NotificationService.deleteAllNotifications(userId);
      setNotifications([]);
    } catch (error) {
      console.error("Delete all failed", error);
    }
  };


  return (
    <>
      <Navbarr />
      <div style={{ padding: 70, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>

          <Popconfirm
            title="Are you sure you want to delete all notifications?"
            onConfirm={handleDeleteAll}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">
              Delete All
            </Button>
          </Popconfirm>
        </div>

        {notifications.length === 0 ? (
          <Empty description="No notifications yet." />
        ) : (
          <List
            grid={{ gutter: 16 , column: 1 }}
            dataSource={notifications}
            renderItem={(notif) => (
              <List.Item>
                <Card
                  style={{
                    backgroundColor: notif.read ? "#fff" : "#fafafa",
                    borderLeft: `5px solid ${notif.read ? "#1890ff" : "#ff4d4f"}`,
                  }}
                  title={
                    <Space>
                      <Text strong>{notif.taskId?.title || "Unknown Task"}</Text>
                    </Space>
                  }
                  extra={
                    <Space>

                      {!notif.read ? (
                        <Tag color="red" onClick={() => markAsRead(notif._id)}>Unread</Tag>
                      ) : (
                        <Tag color="blue">Read</Tag>
                      )}
                      <Popconfirm
                        title="Delete this notification?"
                        onConfirm={() => handleDelete(notif._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <Text>{notif.message}</Text>
                  <div style={{ float:"right", marginTop: 8, color: "#888", fontSize: 12 }}>
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};

export default Notifications;
