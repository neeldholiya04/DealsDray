
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); 
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f0f0f0' }}>
      <div>
        <Link to="/home">Home</Link>
        <Link to="/employees" style={{ marginLeft: '1rem' }}>View All Employees</Link>
      </div>
      <div>
        <span>{user?.name}</span>
        <Button type="primary" onClick={handleLogout} style={{ marginLeft: '1rem' }}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
