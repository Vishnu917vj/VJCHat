import React, { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './searchBar.css';
import ToastEx from './ToastEx';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UserItem from './UserItem';

function SearchModel() {
  const [cond, setCond] = useState();
  const { user, chats = [], setChats, selectedChat, setSelectedChat } = ChatState(); 
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [loadignChat, setLoadingChat] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSearch = async (query) => {
    setSearch(query);  // Update search state with user input
    if (!query) {
      setSearchResult([]);
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/users/allusers?search=${query}`, config);
      setSearchResult(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.post('/api/chat/', { userId }, config);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([...chats, data]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      handleClose();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to access chat');
      setToast(true);
      setTimeout(() => {
        setMsg('');
        setToast(false);
      }, 3000);
      setLoadingChat(false);
    }
  };

  return (
    <div className="search-model" style={{backgroundColor:'rgb(69, 158, 231)',color:'white'}}>
      <div className="search-container" onClick={handleShow}>
        <input type="text" placeholder="Search..." className="search-input" />
        <i className="fas fa-search search-icon"></i>
      </div>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search Users</Offcanvas.Title>
          {toast && <ToastEx msg={msg} />}
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="search-container">
            <input
              type="text"
              autoFocus={true}
              placeholder="Search..."
              onChange={(e) => handleSearch(e.target.value)}  // Trigger search on every input change
            />
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton height={40} width={300} />
                <Skeleton height={40} width={300} />
                <Skeleton height={40} width={300} />
                <Skeleton height={40} width={300} />
                <Skeleton height={20} width={200} />
              </>
            ) : (
              <>
                {searchResult.length > 0 ? (
                  searchResult.map((user) => (
                    <UserItem
                      key={user._id}
                      user={user}
                      pic={user.profilePicture}
                      onClick={() => {
                        setCond(user._id);
                        accessChat(user._id);
                      }}
                      selected={cond === user._id}
                    />
                  ))
                ) : (
                  <p>No results found</p>
                )}
                {loadignChat && <div className="spinner-border"></div>}
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default SearchModel;
