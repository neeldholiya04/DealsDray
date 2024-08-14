import React from 'react';
import { Layout } from 'antd';
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    React.useEffect(() => {
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
    <Layout>
      <Navbar />
      <Content style={{ padding: '0 16px', marginTop: 64, '@media (min-width: 768px)': { padding: '0 50px' } }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 'calc(100vh - 64px)' }}>
          <h1>Home</h1>
        </div>
      </Content>
    </Layout>
  );
};

export default withAuth(Home);