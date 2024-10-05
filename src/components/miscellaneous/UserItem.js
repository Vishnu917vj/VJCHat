import React from 'react';
import '../styles/UserItem.css';

function UserItem(props) {
    return (
        <div 
            id='user-item'
            className="UserItem d-flex align-items-center mx-2 mt-2 border" 
            onClick={props.onClick} // Attach onClick event here
            style={{ cursor: "pointer" , borderRadius: "10px",backgroundColor:props.selected?"blueviolet":"success"}} // Add a pointer cursor for better UX
        >
            <img
                className="rounded-circle mx-2 border"
                src={props.pic||props.user.profilePicture
                    ? props.user.profilePicture
                    : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                alt={props.name||props.user.name || "User Avatar"}
                width={50}
                height={50}
            />
            <span>{props.user.username}</span>
        </div>
    );
}

export default UserItem;
