// Chatbot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Spin, Space, Typography, Row, Col } from 'antd';
import { RobotOutlined, ReloadOutlined } from '@ant-design/icons';
import ToDoServices from '../../services/ToDoServices';
import Navbarr from '../../component/Navbarr';

const { Text, Title } = Typography;

const ChatbotUI = () => {
  const [step, setStep] = useState(null);
  const [options, setOptions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef(null);
  const hasStartedRef = useRef(false); // Prevent duplicate welcome

  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startChat();
    }
  }, []);

  const startChat = async () => {
    setStep('start');
    setMessages([]);
    await fetchBotResponse('start');
  };

  const fetchBotResponse = async (currentStep) => {
    try {
      setLoading(true);
      setOptions([]);

      const response = await ToDoServices.chatbot(currentStep);
      setTimeout(() => {
        const botMsg = {
          sender: 'bot',
          text: response.reply,
          key: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setOptions(response.options || []);
        setLoading(false);
      }, 600);
    } catch (error) {
      console.error('Bot error:', error);
      setLoading(false);
    }
  };

  const handleOptionClick = (nextStep) => {
    const selectedLabel = options.find((opt) => opt.next === nextStep)?.label || 'Selected';
    const userMsg = {
      sender: 'user',
      text: selectedLabel,
      key: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setStep(nextStep);
    fetchBotResponse(nextStep);
  };

  const handleRestart = () => {
    hasStartedRef.current = false;
    startChat();
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <Navbarr />
      <div className="chatbot-wrapper" style={{ maxWidth: 480, margin: '20px auto' }}>
        <Card
          title={<Title level={4}><RobotOutlined /> Task Manager Chatbot</Title>}
          extra={<Button icon={<ReloadOutlined />} onClick={handleRestart}>Restart</Button>}
          bordered={false}
          style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        >
          <div
            className="chat-window"
            ref={chatWindowRef}
            style={{ minHeight: 300, maxHeight: 400, overflowY: 'auto', marginBottom: 16 }}
          >
            {messages.map((msg) => (
              <div
                key={msg.key}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 16px',
                    borderRadius: 16,
                    background: msg.sender === 'user' ? '#69b1ff' : '#fef7e0',
                    color: msg.sender === 'user' ? '#fff' : '#000',
                  }}
                >
                <Text>{msg.text}</Text>  
    
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: 8 }}>
                <Spin size="small" /> <Text style={{ marginLeft: 8 }}>Typing...</Text>
              </div>
            )}
          </div>

          <div className="chat-options">
            <Space direction="vertical" style={{ width: '100%' }}>
              {step === 'listFeatures' ? (
                <Row gutter={[8, 8]}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Col span={8} key={index}>
                      <Button
                        block
                        type="primary"
                        onClick={() => handleOptionClick(`feature${index + 1}`)}
                      >
                        {index + 1}
                      </Button>
                    </Col>
                  ))}
                </Row>
              ) : (
                options.map((opt) => (
                  <Button
                    key={opt.next}
                    type="primary"
                    block
                    onClick={() => handleOptionClick(opt.next)}
                  >
                    {opt.label}
                  </Button>
                ))
              )}
            </Space>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ChatbotUI;

