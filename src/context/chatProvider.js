import { useContext, useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [chats,setChats]=useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if (!userInfo) {
            navigate("/"); // Redirect to home if userInfo is not present
        } else {
            if (window.location.pathname !== "/chat") {
                navigate("/chat"); // Redirect to chat if userInfo exists
            }
        }
    }, [navigate]); // Only include navigate in the dependency array

    return (
        <ChatContext.Provider value={{ user, setUser ,chats,setChats,selectedChat,setSelectedChat,notifications,setNotifications}}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
};
