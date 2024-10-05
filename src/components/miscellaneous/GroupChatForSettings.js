import { useState ,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ChatState } from '../../context/chatProvider';
import axios from 'axios';
import ToastEx from './ToastEx';
import Skeleton from 'react-loading-skeleton';
import UserItemForGroup from './UserItemForGroup';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function GroupChatForSettings({fetchAgain,setFetchAgain}) {
  const [toast, setToast] = useState(false);
  const [msg, setMsg] = useState('');
  const { user, chats, setChats,selectedChat, setSelectedChat } = ChatState();
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState(''); // Handle search input
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [chatLoading,setChatLoading]=useState(false);

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
  useEffect(()=>{
    if(selectedChat){
      setGroupName(selectedChat.chatName);
      setSelectedUsers(selectedChat.users);
    }
  },[selectedChat]);

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

  const handleRemove = async (userToRemove) => {
    // Check if the user exists in the selected users list
    if (selectedUsers.some((user) => user._id === userToRemove._id)) {
      // Update the local state first to reflect removal
      const updatedUsers = selectedUsers.filter((user) => user._id !== userToRemove._id);
      setSelectedUsers(updatedUsers);
        setChatLoading(true);
  
      try {
        // Then update the backend to remove the user from the group
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        const { data } = await axios.put(
          '/api/chat/groupremove',
          {
            chatId: selectedChat._id,
            userId: userToRemove._id,
          },
          config
        );
  
        // Update the selected chat with the new list of users from the backend
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setChatLoading(false);
      } catch (err) {
        setChatLoading(false);
        console.log(err);
        setMsg('Something went wrong while removing the user from the group');
        setToast(true);
        setTimeout(() => setToast(false), 3000);
      }
    }
  };
  
  const handleAdd = async (e) => {
    e.preventDefault();
  
    try {
      setChatLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Use the current logged-in user's token
        },
      };
  
      // Loop through the selectedUsers array to add them individually if they're not in the group
      for (const selectedUser of selectedUsers) {
        if (selectedChat.users.some((u) => u._id === selectedUser._id)) {
          continue;  // Skip the user already in the group
        }
        // Make the API call to add the user to the group
        const { data } = await axios.put(
          '/api/chat/groupadd',
          {
            chatId: selectedChat._id,
            userId: selectedUser._id,
          },
          config
        );
  
        // Update `selectedChat` with the latest data returned from the server after each addition
        setSelectedChat(data);
      }
  
      // Trigger re-fetch to reflect changes across the app
      setFetchAgain(!fetchAgain);
    } catch (err) {
      console.log(err);
      setMsg('Something went wrong while adding users');
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } finally {
      setChatLoading(false);
    }
  };
  const handleRename =async (e) => {
    e.preventDefault();
    if(!(groupName==selectedChat.name))
    {
        setChatLoading(true);
        try
        {
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
            };
            const {data}=await axios.put('/api/chat/rename',{
                chatId:selectedChat._id,
                chatName:groupName,
            },config);
            setSelectedChat(data);
            setChatLoading(false);
        }
        catch(err)
        {
            setChatLoading(false);
            console.log(err);
           setMsg('Something went wrong while creating group');
            setToast(true);
           setTimeout(() => setToast(false), 3000);
        }
    }
  }
  return (
    <>
      <Button variant="muted" onClick={handleShow} className="btn btn-muted btn-sm">
      <i className="fas fa-cog" style={{ fontSize: '24px', cursor: 'pointer' }}></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedChat.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="search-container">
            <input
              type="text"
              value={groupName}
              onChange={(e)=>setGroupName(e.target.value)}
              placeholder="Rename group ?"
              className="search-input"
            />
            <button onClick={handleRename}>
                rename
            </button>
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
        <>
          {chatLoading && <div className="spinner-border"></div>}
        </>
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
          <Button variant="primary" onClick={handleAdd}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GroupChatForSettings;
