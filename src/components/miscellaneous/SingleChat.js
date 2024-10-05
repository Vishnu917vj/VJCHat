import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatState } from '../../context/chatProvider';
import GroupChatForSettings from './GroupChatForSettings';
import ChatSettings from './ChatSettings';
import ChatSkeleton from './ChatSkeleton';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import ToastEx from './ToastEx';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import * as animationData from '../../animation/typing.json';
import { getPic, getSender } from '../config/ChatLogic';
import '../styles/anime.css'

const endpoint = "http://localhost:5000";
let socket, selectedChatCompare;

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid meet', // Change to 'meet' instead of 'slice'
  }
};


function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, notifications, setNotifications } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [toast, setToast] = useState(false);
  const [msg, setMsg] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const lastTypingTime = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      console.error('Failed to fetch messages', error);
      setMsg('Failed to load messages. Please try again.');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } finally {
      setLoading(false);
    }
  }, [selectedChat, user.token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, fetchAgain]);

  useEffect(() => {
    socket = io(endpoint);
    socket.emit('setup', user);
    socket.on('connection', () => {
      console.log('Socket connected');
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      console.log('User is typing');
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      console.log('User stopped typing');
      setIsTyping(false);
    });

    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, [user]);

  useEffect(() => {
    socket.on('message received', (newMessage) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessage.chat._id) {
        if (!notifications.includes(newMessage)) {
          setNotifications([...notifications, newMessage]);
          setFetchAgain(!fetchAgain);
          alert('New message received!');
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off('message received'); 
    };
  }, [selectedChatCompare]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    lastTypingTime.current = new Date().getTime();
    const timerLength = 3000; // Time to wait before emitting stop typing

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime.current;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messageData = { content: newMessage, chatId: selectedChat._id };
      setMessages((prevMessages) => [...prevMessages, { ...messageData, sender: user }]);
      setNewMessage('');
      socket.emit('stop typing', selectedChat._id); // Notify others that typing has stopped

      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const { data } = await axios.post('/api/message', messageData, config);
        socket.emit('new message', data);
      } catch (error) {
        console.error('Error sending message', error);
        setMsg('Failed to send message. Please try again.');
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      }
    } else {
      setMsg('Message cannot be empty.');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }
  };

  return (
    <div>
      {selectedChat ? (
        <>
          <div className="singleChat d-flex">
            <div className="bg-success p-3 text-center text-white w-100 d-flex align-items-center justify-content-center rounded" style={{ borderRadius: '10px' }}>
              <h2>{getSender(user, selectedChat.users) || selectedChat.name}</h2>
            </div>
            {selectedChat.isGroupChat ? (
              <GroupChatForSettings chat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            ) : (
              <ChatSettings chat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </div>
          {toast && <ToastEx msg={msg} setToast={setToast} />}
          <div className="chat-window" style={{ height: '400px', overflowY: 'auto', marginBottom: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
            <div className="messages-container">
              {loading ? (
                <ChatSkeleton />
              ) : (
                messages.map((msg, index) => {
                  const isUserMessage = msg.sender._id === user._id;

                  return (
                    <div
                      key={index}
                      className={`message ${isUserMessage ? 'sent' : 'received'}`}
                      style={{
                        display: 'flex',
                        flexDirection: isUserMessage ? 'row-reverse' : 'row',
                        alignItems: 'center',
                        justifyContent: isUserMessage ? 'flex-end' : 'flex-start',
                        margin: '10px 0',
                        maxWidth: '100%',
                      }}
                    >
                      {!isUserMessage && (
                        <img
                          className="rounded-circle mx-2 border"
                          src={msg.sender.profilePicture || getPic(selectedChat.users, user) || 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                          alt="User Avatar"
                          width={50}
                          height={50}
                        />
                      )}
                      <div
                        style={{
                          backgroundColor: isUserMessage ? '#d1f0d1' : '#e6e6e6',
                          padding: '10px',
                          borderRadius: '15px',
                          marginLeft: isUserMessage ? 'auto' : '10px',
                          textAlign: isUserMessage ? 'right' : 'left',
                          maxWidth: '60%',
                        }}
                      >
                        <p style={{ margin: 0 }}>{msg.content}</p>
                        <span className="sent-time" style={{ fontSize: '12px', marginLeft: isUserMessage ? 'auto' : '10px' }}>
                          Sent at {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
             {isTyping && (
  <div className="typing-indicator">
    <Lottie options={defaultOptions} height={50} width={50} />
  </div>

)}{
isTyping && (
  <div className="typing-indicator" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    TYPING...
  </div>
)}


            </div>
          </div>
          <Form onSubmit={handleSendMessage} className="d-flex mt-2">
            <Form.Control
              type="text"
              placeholder={isTyping ? "Typing..." : "Type a message..."}
              value={newMessage}
              onChange={typingHandler}
              className="mr-2"
              style={{ borderRadius: '20px' }}
            />
            <Button type="submit" variant="primary" style={{ borderRadius: '20px' }}>
              Send
            </Button>
          </Form>
        </>
      ) : (
        <div className="bg-primary p-3 text-center text-white">
          <h2>Select a Chat</h2>
        </div>
      )}
    </div>
  );
}

export default SingleChat;
