import Navbar from "../components/Navbar";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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

const Home = () => {
    return (
        <div>
            <Navbar></Navbar>
            <h1>Home</h1>
        </div>
    );
    };

export default withAuth(Home);