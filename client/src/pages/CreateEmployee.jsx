import React, { useState } from "react";
import { Form, Input, Button, Select, message, Typography, Space, Layout, Row, Col } from "antd";
import { addUser } from "../calls/users";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;
const { Content } = Layout;

const CreateEmployeeForm = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleErrorResponse = (error, customMessage) => {
    if (error.response && error.response.data) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          message.error(data.message || 'Bad Request. Please check your input.');
          break;
        case 401:
          message.error(data.message || 'Unauthorized. Please log in again.');
          navigate('/');
          break;
        case 403:
          message.error(data.message || 'Forbidden. You do not have permission to perform this action.');
          break;
        case 409:
          message.error(data.message || 'Conflict. This employee already exists.');
          break;
        case 500:
          message.error(data.message || 'Internal Server Error. Please try again later.');
          break;
        default:
          message.error(data.message || customMessage || 'An unexpected error occurred. Please try again.');
      }
    } else if (error.message) {
      message.error(error.message);
    } else {
      message.error(customMessage || 'An unexpected error occurred. Please try again.');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await addUser(values);
      if (response.success) {
        message.success("Employee added successfully");
        form.resetFields();
      } else {
        handleErrorResponse(response, "Failed to add employee");
      }
    } catch (error) {
      handleErrorResponse(error, "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = (value) => {
    setRole(value);
  };

  return (
    <Layout>
      <Navbar />
      <Content style={{ padding: '16px', marginTop: 64 }}>
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Title level={2} style={{ textAlign: 'center' }}>Create Employee</Title>
                <Form layout="vertical" onFinish={onFinish} form={form}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter employee name" }]}
                  >
                    <Input placeholder="Enter employee name" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter employee email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="Enter employee email" />
                  </Form.Item>

                  <Form.Item
                    label="Mobile Number"
                    name="mobile_no"
                    rules={[
                      { required: true, message: "Please enter mobile number" },
                      { pattern: /^[0-9]+$/, message: "Please enter a valid contact number" }
                    ]}
                  >
                    <Input placeholder="Enter mobile number" />
                  </Form.Item>

                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please select employee role" }]}
                  >
                    <Select placeholder="Select employee role" onChange={onRoleChange}>
                      <Option value="admin">Admin</Option>
                      <Option value="user">User</Option>
                    </Select>
                  </Form.Item>

                  {role === "admin" && (
                    <>
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                          { required: true, message: "Please enter username" },
                          { min: 3, message: "Username must be at least 3 characters long" }
                        ]}
                      >
                        <Input placeholder="Enter username" />
                      </Form.Item>

                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          { required: true, message: "Please enter password" },
                          { min: 6, message: "Password must be at least 6 characters long" }
                        ]}
                      >
                        <Input.Password placeholder="Enter password" />
                      </Form.Item>
                    </>
                  )}

                  <Form.Item
                    label="Designation"
                    name="designation"
                    rules={[
                      { required: true, message: "Please enter employee designation" },
                    ]}
                  >
                    <Input placeholder="Enter employee designation" />
                  </Form.Item>

                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: "Please select employee gender" }]}
                  >
                    <Select placeholder="Select employee gender">
                      <Option value="Male">Male</Option>
                      <Option value="Female">Female</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Course"
                    name="course"
                    rules={[{ required: true, message: "Please enter employee course" }]}
                  >
                    <Input placeholder="Enter employee course" />
                  </Form.Item>

                  <Form.Item
                    label="Image Link"
                    name="img_link"
                    rules={[
                      { required: true, message: "Please enter employee image link" },
                      { type: "url", message: "Please enter a valid URL" }
                    ]}
                  >
                    <Input placeholder="Enter employee image link" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                      Add Employee
                    </Button>
                  </Form.Item>
                </Form>
              </Space>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CreateEmployeeForm;