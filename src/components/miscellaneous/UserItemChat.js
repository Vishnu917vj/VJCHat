import React, { useEffect } from 'react';
import { getPic } from '../config/ChatLogic';
import '../styles/UserItem.css';

function UserItemChat({ chat, user, onClick, selected, pic }) {
  useEffect(() => {
    
  }, [selected]);

  return (
    <div 
      id='user-item'
      className="d-flex align-items-center mx-2 mt-2 border" 
      onClick={onClick} 
      style={{ cursor: "pointer", borderRadius: "10px", backgroundColor: selected ? 'blueviolet' : 'rgb(84, 163, 228)' }}
    >
      <img
        className="rounded-circle mx-2 border"
        src={pic || getPic(chat.users, user) || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
        alt={user?.username || chat.chatName || "User Avatar"}
        width={50}
        height={50}
      />
      <span style={{ flexGrow: 1 }}>{user?.username || chat.chatName || "Unnamed Chat"}</span>
    </div>
  );
}

export default UserItemChat;
