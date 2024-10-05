import React, { useState } from 'react';  // Import useState from React
import { ChatState } from '../context/chatProvider';
import SideDwawer from '../components/miscellaneous/SideDwawer';
import MyChats from '../components/miscellaneous/MyChats';
import ChatBox from '../components/miscellaneous/ChatBox';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Chat = () => {   
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);  // useState hook initialized

  return (
    <div style={{ height: '100vh' ,fontSize:'20px'}}>
      <Row>
        <Col>{user && <SideDwawer  />}</Col>
      </Row>
      <Row style={{ height: '100%', width: '100%' }}>
        <Col xs={4}>{user && <MyChats fetchAgain={fetchAgain} />}</Col>  {/* 40% width */}
        <Col xs={8}>{user && <ChatBox setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}</Col>  {/* 60% width */}
      </Row>
    </div>
  );
};

export default Chat;
