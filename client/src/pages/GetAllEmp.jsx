import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, Modal, Form, Input, Select, Layout, Row, Col, Typography } from 'antd';
import { getAllEmployees, deleteEmployee, updateEmployee } from '../calls/users'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 

const { Option } = Select;
const { Search } = Input;
const { Content } = Layout;
const { Title, Text } = Typography;

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

const AllEmployee = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editEmployeeVisible, setEditEmployeeVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate(); 

  useEffect(() => {
    fetchEmployees();
  }, []);

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
        case 404:
          message.error(data.message || 'Resource not found.');
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

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getAllEmployees();
      const nonAdminEmployees = data.data.filter(employee => employee.role !== 'admin');
      setEmployees(nonAdminEmployees);
      setFilteredEmployees(nonAdminEmployees);
      setEmployeeCount(nonAdminEmployees.length);
    } catch (error) {
      handleErrorResponse(error, 'Failed to fetch employees');
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
      handleErrorResponse(error, 'Failed to delete employee');
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
        ...values,
        role: selectedEmployee.role, // Ensure role is not changed
      };

      await updateEmployee(selectedEmployee._id, updatedEmployee);
      message.success('Employee updated successfully');
      fetchEmployees();
      setEditEmployeeVisible(false);
      setSelectedEmployee(null);
      form.resetFields();
    } catch (error) {
      if (error.errorFields) {
        // Form validation error
        form.scrollToField(error.errorFields[0].name);
      } else {
        handleErrorResponse(error, 'Failed to update employee');
      }
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
      responsive: ['md'],
    },
    {
      title: 'Mobile Number',
      dataIndex: 'mobile_no',
      key: 'mobile_no',
      responsive: ['lg'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      responsive: ['sm'],
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      responsive: ['lg'],
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      responsive: ['md'],
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      responsive: ['xl'],
    },
    {
      title: 'Image Link',
      dataIndex: 'img_link',
      key: 'img_link',
      responsive: ['xl'],
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
    <Layout>
      <Navbar />
      <Content style={{ padding: '16px', marginTop: 64 }}>
        <Row justify="center">
          <Col xs={24} lg={20} xl={18}>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Title level={2}>Employee List</Title>
                  <Text strong>Total Employees: {employeeCount}</Text>
                </div>
                <Space wrap>
                  <Button type="primary" onClick={fetchEmployees} loading={loading}>
                    Refresh
                  </Button>
                  <Button type="primary" onClick={() => navigate('/create')}>
                    Add Employee
                  </Button>
                </Space>
                <Search
                  placeholder="Search employees"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onSearch={handleSearch}
                  style={{ width: '100%' }}
                  enterButton
                />
                <Table
                  columns={columns}
                  dataSource={filteredEmployees}
                  rowKey="_id"
                  loading={loading}
                  scroll={{ x: 'max-content' }}
                />
              </Space>
              <Modal
                title="Edit Employee"
                visible={editEmployeeVisible}
                onCancel={handleEditCancel}
                onOk={handleEditSubmit}
              >
                <Form form={form} layout="vertical">
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter employee name' }]}
                  >
                    <Input placeholder="Enter employee name" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please enter employee email' }, { type: 'email', message: 'Please enter a valid email' }]}
                  >
                    <Input placeholder="Enter employee email" />
                  </Form.Item>
                  <Form.Item
                    label="Mobile Number"
                    name="mobile_no"
                    rules={[{ required: true, message: 'Please enter mobile number' }]}
                  >
                    <Input placeholder="Enter mobile number" />
                  </Form.Item>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please select employee role' }]}
                  >
                    <Select placeholder="Select employee role" disabled>
                      <Option value="admin">Admin</Option>
                      <Option value="user">User</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Designation"
                    name="designation"
                    rules={[{ required: true, message: 'Please enter employee designation' }]}
                  >
                    <Input placeholder="Enter employee designation" />
                  </Form.Item>
                  <Form.Item
                    label="Gender"
                    name="gender"
                    rules={[{ required: true, message: 'Please select employee gender' }]}
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
                    rules={[{ required: true, message: 'Please enter employee course' }]}
                  >
                    <Input placeholder="Enter employee course" />
                  </Form.Item>
                  <Form.Item
                    label="Image Link"
                    name="img_link"
                    rules={[{ required: true, message: 'Please enter employee image link' }]}
                  >
                    <Input placeholder="Enter employee image link" />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default withAuth(AllEmployee);