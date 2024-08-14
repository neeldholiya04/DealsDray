import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Layout, Menu, Typography, Drawer } from 'antd';
import { HomeOutlined, TeamOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const getSelectedKey = () => {
    if (location.pathname === '/home') return 'home';
    if (location.pathname === '/employees') return 'employees';
    return '';
  };

  return (
    <Header style={{ 
      position: 'fixed', 
      zIndex: 1, 
      width: '100%', 
      padding: '0 20px',
      background: '#001529',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div className="logo" style={{ 
        color: 'white', 
        fontSize: '24px', 
        fontWeight: 'bold',
      }}>
        DealsDray
      </div>
      <div className="menu-section" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="desktop-menu" style={{ display: 'none', flex: 1 }}>
          <Menu 
            theme="dark" 
            mode="horizontal" 
            selectedKeys={[getSelectedKey()]}
            style={{ 
              background: 'transparent', 
              borderBottom: 'none',
            }}
          >
            <Menu.Item key="home" icon={<HomeOutlined />} style={{ fontSize: '16px' }}>
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="employees" icon={<TeamOutlined />} style={{ fontSize: '16px' }}>
              <Link to="/employees">View All Employees</Link>
            </Menu.Item>
          </Menu>
        </div>
        <div className="mobile-menu" style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            icon={<MenuOutlined />} 
            onClick={showDrawer}
            style={{ 
              color: 'white', 
              background: 'transparent', 
              border: 'none',
              display: 'block',
            }}
          />
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: '16px',
      }}>
        <Text style={{ color: 'white', fontSize: '16px' }}>{user?.name}</Text>
        <Button 
          type="primary" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          style={{ 
            background: '#1890ff', 
            borderColor: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            fontSize: '16px',
          }}
        >
          Logout
        </Button>
      </div>
      <Drawer 
        title="Menu" 
        placement="right" 
        onClose={onClose} 
        visible={visible}
        style={{ padding: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        <Menu 
          mode="vertical" 
          selectedKeys={[getSelectedKey()]}
          style={{ border: 'none' }}
          onClick={onClose}
        >
          <Menu.Item key="home" icon={<HomeOutlined />} style={{ fontSize: '16px' }}>
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="employees" icon={<TeamOutlined />} style={{ fontSize: '16px' }}>
            <Link to="/employees">View All Employees</Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </Header>
  );
};

export default Navbar;
