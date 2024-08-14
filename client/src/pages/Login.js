import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Layout, Alert } from "antd";
import { useNavigate } from "react-router-dom";
import { LoginUser } from '../calls/users';
import { useAuth } from '../context/AuthContext';

const { Content } = Layout;

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LoginUser(values);
      if (response && response.success) {
        message.success(response.message);
        localStorage.setItem('token', response.accessToken);
        login({ username: values.username });
        navigate('/home');
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      handleErrorResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const handleErrorResponse = (error) => {
    if (error && error.response && error.response.data) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          if (data.message.includes("User does not exist")) {
            setError('Username does not exist. Please check your username.');
            form.setFields([
              {
                name: 'username',
                errors: ['Username does not exist'],
              },
            ]);
          } else {
            setError(data.message || 'Bad Request. Please check your input.');
          }
          break;
        case 401:
          setError('Invalid credentials. Please check your username and password.');
          break;
        case 404:
          setError('Username does not exist. Please check your username.');
          form.setFields([
            {
              name: 'username',
              errors: ['Username does not exist'],
            },
          ]);
          break;
        case 500:
          setError('Internal Server Error. Please try again later.');
          break;
        default:
          setError(data.message || 'An unexpected error occurred. Please try again.');
      }
    } else if (error && error.message) {
      if (error.message.includes("User does not exist")) {
        setError('Username does not exist. Please check your username.');
        form.setFields([
          {
            name: 'username',
            errors: ['Username does not exist'],
          },
        ]);
      } else {
        setError(error.message);
      }
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Layout>
      <Content style={{ 
        padding: '50px 16px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        '@media (min-width: 768px)': { padding: '50px' }
      }}>
        <div style={{ 
          background: '#fff', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Login</h1>
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: '16px' }}
            />
          )}
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 3, message: 'Username must be at least 3 characters long' }
              ]}
            >
              <Input placeholder="Enter your Username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: 'Password must be at least 6 characters long' }
              ]}
            >
              <Input.Password placeholder="Enter your Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block style={{ fontSize: "16px", fontWeight: "600" }}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default Login;