import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, Modal, Form, Input, Select } from 'antd';
import { getAllEmployees, deleteEmployee, updateEmployee } from '../calls/users'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const { Option } = Select;
const { Search } = Input;

const AllEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editEmployeeVisible, setEditEmployeeVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getAllEmployees();
      setEmployees(data.data); 
      setFilteredEmployees(data.data);
    } catch (error) {
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      message.error('Failed to delete employee');
    }
  };

  const showEditModal = (employee) => {
    setSelectedEmployee(employee);
    form.setFieldsValue(employee);
    setEditEmployeeVisible(true);
  };

  const handleEditCancel = () => {
    setEditEmployeeVisible(false);
    setSelectedEmployee(null);
    form.resetFields();
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedEmployee = {
        name: values.name,
        email: values.email,
        mobile_no: values.mobile_no,
        role: values.role,
        designation: values.designation,
        gender: values.gender,
        course: values.course,
        img_link: values.img_link,
      };

      await updateEmployee(selectedEmployee._id, updatedEmployee);
      message.success('Employee updated successfully');
      fetchEmployees();
      setEditEmployeeVisible(false);
      setSelectedEmployee(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to update employee');
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredEmployees(employees);
    } else {
      const lowercasedQuery = query.toLowerCase();
      const filteredData = employees.filter((employee) =>
        employee.name.toLowerCase().includes(lowercasedQuery) ||
        employee.email.toLowerCase().includes(lowercasedQuery) ||
        employee._id.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredEmployees(filteredData);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile_no',
      key: 'mobile_no',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Image Link',
      dataIndex: 'img_link',
      key: 'img_link',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showEditModal(record)}>Edit</Button>
          <Button type="danger" onClick={() => handleDelete(record._id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
        <Navbar />
      <h1>Employee List</h1>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={fetchEmployees} loading={loading}>
          Refresh
        </Button>
        <Button type="primary" onClick={() => navigate('/create')}>
          Add Employee
        </Button>
        <Search
          placeholder="Search by Name, Email or ID"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchQuery}
          enterButton
        />
      </Space>
      <Table columns={columns} dataSource={filteredEmployees} rowKey="_id" />

      <Modal
        title="Edit Employee"
        visible={editEmployeeVisible}
        onCancel={handleEditCancel}
        onOk={handleEditSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="mobile_no" label="Mobile Number" rules={[{ required: true, message: 'Please enter mobile number' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Please select role' }]}>
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
          <Form.Item name="designation" label="Designation" rules={[{ required: true, message: 'Please enter designation' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="course" label="Course" rules={[{ required: true, message: 'Please enter course' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="img_link" label="Image Link" rules={[{ required: true, message: 'Please enter image link' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllEmployee;
