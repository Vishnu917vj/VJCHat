import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import Login from '../components/authentication/Login';
import Signin from '../components/authentication/Signin';

const Home = () => {
  const [login, setLogin] = useState(false);

  return (
    <div
      style={{
        backgroundColor: 'rgb(69, 158, 231)',
        textAlign: 'center',
        color: 'white',
        width: '100vw', // Updated for full width
        border: '1px solid white',
        borderRadius: '10px',
        marginTop: '10vh',
        padding: '2rem', // Added padding for spacing
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Container fluid className="p-3">
        {/* Make the login/signin switch buttons responsive */}
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <div
              className={`btn btn-lg w-100 ${login ? 'btn-primary' : 'btn-outline-primary'}`}
              style={{ borderRadius: '10px' }}
              onClick={() => setLogin(true)}
            >
              Login
            </div>
          </Col>
          <Col xs={12} md={6} className="mt-2 mt-md-0">
            <div
              className={`btn btn-lg w-100 ${!login ? 'btn-success' : 'btn-outline-success'}`}
              style={{ borderRadius: '10px' }}
              onClick={() => setLogin(false)}
            >
              Sign In
            </div>
          </Col>
        </Row>

        <hr />

        {/* Make the form responsive */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            {login ? <Login /> : <Signin />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home; 
