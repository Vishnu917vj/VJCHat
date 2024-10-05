import React, { useState, useEffect } from 'react';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import UserItemChat from './UserItemChat';
import Skeleton from 'react-loading-skeleton';
import GroupChatModel from './GroupChatModel';
import { getPic, getSender } from '../config/ChatLogic';

function MyChats({ fetchAgain }) {
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    if (!user || !user.token) return;

    setLoading(true);
    setError(null);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.get('/api/chat/', config);
      console.log("Fetched chats: ", data);
      setChats(data);
    } catch (error) {
      console.error('Failed to fetch chats', error);
      setError('Failed to load chats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchAgain]);

  const handleChatSelect = (chat) => {
    const isGroupChat = chat.isGroupChat;
    const otherUser = isGroupChat ? null : chat.users.find((u) => u._id !== user._id);
    
    const senderName = isGroupChat 
        ? chat.chatName 
        : otherUser.username
        ? getSender(user, chat.users) 
        : "Unknown User"; // Fallback for unknown user

    const selectedChatDetails = {
        ...chat,
        name: senderName,
        pic: isGroupChat ? null : otherUser ? getPic(chat.users, user) : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg', // Provide a default picture
    };

    setSelectedChat(selectedChatDetails);
};

  

  return (
    <div className="d-flex flex-column bg-light text-dark px-10" style={{ height: '100vh', overflowY: 'auto', width: '100%', padding: '10px', margin: '10px' }}>
      <div className='d-flex justify-content-between'>
        <h3>My Chats</h3>
        <GroupChatModel />
      </div>

      {loading ? (
        <Skeleton count={5} height={50} width={'100%'} />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {chats && chats.length > 0 ? (
            chats.map((chat) => {
              // For one-on-one chats, find the other user
              const otherUser = chat.isGroupChat
                ? chat.chatName  // Use group chat name for group chats
                : chat.users.find((u) => u._id !== user._id); // Find the other user for one-on-one chats

              return (
                <UserItemChat
                  key={chat._id}
                  chat={chat} // Pass the entire chat object
                  user={otherUser || 'Unknown'}  // Display other user or fallback to 'Unknown'
                  onClick={() => handleChatSelect(chat)}
                  name={chat.isGroupChat ? chat.chatName : getSender(user, chat.users)}
                  selected={selectedChat?._id === chat._id}
                  pic={chat.isGroupChat ? null : otherUser?.profilePicture
                    ||"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"} // Provide fallback for missing pics
                />
              );
            })
          ) : (
            <p>No chats available</p>
          )}
        </>
      )}
    </div>
  );
}

export default MyChats;