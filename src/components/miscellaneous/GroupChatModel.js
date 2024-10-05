import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import ToastEx from './ToastEx';
import Skeleton from 'react-loading-skeleton';
import UserItemForGroup from './UserItemForGroup';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function GroupChatModel() {
  const [toast, setToast] = useState(false);
  const [msg, setMsg] = useState('');
  const { user, chats, setChats } = ChatState();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState(''); // Handle search input
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      setToast(true);
      setMsg(`${userToAdd.name} already added`);
      setTimeout(() => setToast(false), 3000);
      return;
    }
    // Add user to the selectedUsers array
    setSelectedUsers([...selectedUsers, userToAdd]);
    console.log('Selected Users:', [...selectedUsers, userToAdd]);
  };
  

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query) {
      setSearchResult([]); // Clear results if search is empty
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/users/allusers?search=${query}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSearchResult(data);
    } catch (error) {
      console.log(error);
      setMsg('Something went wrong while searching');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (userToRemove) => {
    // Remove the user by filtering out the removed user
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userToRemove._id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName || selectedUsers.length === 0) {
      setToast(true);
      setMsg('Please fill all the fields');
      setTimeout(() => setToast(false), 3000);
      return;
    }

    const groupChatData = {
      name: groupName.trim(),
      users:JSON.stringify(selectedUsers.map((u) => u._id)),
      groupAdmin: user,
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = axios.post('/api/chat/group', groupChatData, config);

      setChats([data, ...chats]);

      setToast(true);
      setMsg('Group created successfully');
      setTimeout(() => {
        setToast(false);
        handleClose();
      }, 3000);

      setSelectedUsers([]);
      setGroupName('');
    } catch (error) {
      console.log(error);
      setMsg('Something went wrong while creating group');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="btn btn-primary btn-sm">
        Create new group <i className="fas fa-plus"></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="search-container">
            <input
              type="text"
              value={groupName}
              onChange={(e)=>setGroupName(e.target.value)}
              placeholder="GroupChatName"
              className="search-input"
            />
          </div>
          <div className="search-container">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Add users e.g., Josh, John..."
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          {toast && <ToastEx msg={msg} />}
          <div>
          <div>
  <Stack direction="horizontal" gap={2}>
    {selectedUsers.length > 0 ? (
      selectedUsers.map((user) => (
        <Badge
          key={user._id}
          bg="primary"
          onClick={() => handleRemove(user)}
          style={{ cursor: "pointer" }}
        >
          {user.username} <i className="fas fa-times"></i> {/* Adding a close icon for UX */}
        </Badge>
      ))
    ) : (
      <div>No users selected</div>
    )}
  </Stack>
</div>

            {loading ? (
              <Skeleton count={5} height={40} />
            ) : (
              searchResult?.map((user) => (
                <UserItemForGroup
                  key={user._id}
                  user={user}
                  onClick={handleGroup}
                  selected={selectedUsers.some((u) => u._id === user._id)} // Check if selected
                />
              ))
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GroupChatModel;
