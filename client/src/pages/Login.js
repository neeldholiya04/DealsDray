import React, { useEffect } from 'react'
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from '../calls/users';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')){
        navigate("/");
    }
  }, [navigate]); 

  const onFinish = async (values) => {
    try {
      const response = await LoginUser(values);
      if (response.success) {
        message.success(response.message);
        localStorage.setItem('token', response.token);
        navigate('/home');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <>
      <header className="App-header">
        <main className="main-area mw-500 text-center px-3">
          <section className="left-section">
            <h1>Login</h1>
          </section>

          <section className="right-section">
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Username"
                htmlFor="username"
                name="username"
                className="d-block"
                rules={[{ required: true}]}
              >
                <Input id="email" type="text" placeholder="Enter your Username" />
              </Form.Item>

              <Form.Item
                label="Password"
                htmlFor="password"
                name="password"
                className="d-block"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input id="password" type="password" placeholder="Enter your Password" />
              </Form.Item>

              <Form.Item className="d-block">
                <Button type="primary" block htmlType="submit" style={{ fontSize: "1rem", fontWeight: "600" }}>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </section>
        </main>
      </header>
    </>
  );
}

export default Login;
