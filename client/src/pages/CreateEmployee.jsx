import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { addUser } from "../calls/users";
import Navbar from "../components/Navbar";

const { Option } = Select;

const CreateEmployeeForm = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await addUser(values);
      if (response.success) {
        message.success("Employee added successfully");
        form.resetFields();
      } else {
        message.error(response.message || "Failed to add employee");
      }
    } catch (error) {
      message.error("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const onRoleChange = (value) => {
    setRole(value);
  };

  return (
    <>
      <Navbar />
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
          rules={[{ required: true, message: "Please enter mobile number" }]}
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
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input placeholder="Enter username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password" }]}
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
          ]}
        >
          <Input placeholder="Enter employee image link" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Employee
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateEmployeeForm;
