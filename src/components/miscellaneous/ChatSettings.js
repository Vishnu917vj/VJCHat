import React, { useEffect } from 'react'
import { useState } from 'react';
import { ChatState } from '../../context/chatProvider'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getPic, getSender } from '../config/ChatLogic';

function ChatSettings({fetchAgain, setFetchAgain}) {
  const {user,selectedChat,setSlectedChat} = ChatState();
  const [show, setShow] = useState(false);
  const getPic = (users)=>{
    if(users[0]._id===user._id){
        return users[1].pic
    }else{
        return users[0].pic
    }
}

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    useEffect(() => {
      console.log("selected chat",selectedChat)
    })
  return (
    <div>
     <Button variant="muted" onClick={handleShow}>
     <i className="fas fa-cog" style={{ fontSize: '24px', cursor: 'pointer' }}></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat.name||getSender(selectedChat.users,user)}</Modal.Title>
        </Modal.Header>
        <Modal.Body><img src={selectedChat?.pic||getPic(selectedChat.users,user)||"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} alt="" style={{width:'200px',height:'200px'}}></img></Modal.Body>
      </Modal>
    </div>
  )
}

export default ChatSettings