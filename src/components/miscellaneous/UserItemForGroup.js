import React from 'react';

function UserItemForGroup({ user, onClick, selected }) {
    return (
        <div 
            className="d-flex align-items-center mx-2 mt-2 border" 
            onClick={() => onClick(user)} // Pass the user object correctly
            style={{ 
                cursor: "pointer", 
                borderRadius: "10px", 
                backgroundColor: selected ? "blueviolet" : "white" // Highlight if selected
            }}
        >
            <img
                className="rounded-circle mx-2 border"
                src={user.pic ? user.pic : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt={user.name || "User Avatar"}
                width={50}
                height={50}
            />
            <span>{user.username}</span>
        </div>
    );
}

export default UserItemForGroup;
