import React from 'react'
import { useState } from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ChatState } from '../../context/chatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import SearchModel from './SearchModel';
import { getSender } from '../config/ChatLogic';

function SideDwawer() {
  const { user,notifications,setNotifications,selectedChat,setSelectedChat} = ChatState();
    const navigate=useNavigate();
    const handleLogout=()=>
    {
        localStorage.removeItem("userInfo");
        navigate("/");
    }
  return (
    <Row>
    <div className='side-dwawer' style={{width:'100%',height:'10vh',backgroundColor:'rgb(69, 158, 231)',color:'black',display:'flex',justifyContent:'space-between',alignItems:'center',textAlign:'center'}}>
      <Col>
      <SearchModel></SearchModel>
        </Col> 
       <Col> VjChat</Col>
        <Col>
        <Dropdown>
      <Dropdown.Toggle variant="white" id="dropdown-basic">
    <i className="fa-solid fa-bell"></i> <span class="badge badge-danger">{
      notifications.length>0?notifications.length:""
}</span>

      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item> */}
        {
          !notifications.length && <Dropdown.Item >No Notifications</Dropdown.Item>
        }

        {
          notifications.map((notification)=>(
            <Dropdown.Item onClick={()=>{
              setNotifications(notifications.filter((n)=>n!==notification))
              setSelectedChat(notification.chat)
            }}
             >{notification.chat.isGroupChat ?`New Message in ${notification.chat.chatName}`: `New Message from ${notification.sender.username||getSender(user,notification.chat.users)}`}</Dropdown.Item>
          ))
        }
      </Dropdown.Menu>
    </Dropdown>
    </Col>
    <Col>
    <Dropdown>
      <Dropdown.Toggle variant="white" id="dropdown-basic">
    <img src={user.pic||"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} className="rounded-circle" alt="img" style={{height:'25px',width:'25px'}}></img>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item ><ProfileModel/></Dropdown.Item>
        <Dropdown.Item ></Dropdown.Item>
        <Dropdown.Item ><button className="btn btn-danger" onClick={handleLogout}>Logout</button></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </Col></div>
    </Row>
  )
}

export default SideDwawer