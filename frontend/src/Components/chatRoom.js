import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Button, List, ListItem, ListItemText } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { API_ENDPOINT } from "../Components/api";
import Navbar from './navbar';

function ChatRoom() {
    const { user } = useContext(AuthContext);
    const [roomName, setRoomName] = useState('hello');
    const [chatLog, setChatLog] = useState('');
    const [chatMessage, setChatMessage] = useState('');
    const [chatSocket, setChatSocket] = useState(null);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
    if (chatSocket) {
        chatSocket.close();
    }
    setChatSocket(new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`));

    return () => {
        if (chatSocket) {
        chatSocket.close();
        }
    };
    }, [roomName]);

    useEffect(() => {
    // Fetch the list of friends for the active user
    async function fetchFriends() {
        const response = await fetch(`${API_ENDPOINT}/friends-list/${user.user_id}`);
        const data = await response.json();
        setFriends(data.friends);
    }

    fetchFriends();

    console.log(friends);

    if (chatSocket) {
        chatSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.message) {
            setChatLog(
            (chatLog) => chatLog + data.message.author + ': ' + data.message.content + '\n'
            );
        } else if (data.messages) {
            data.messages.map((msg) => {
            setChatLog(
                (chatLog) => chatLog + msg.author + ': ' + msg.content + '\n'
            );
            });
        }
        };

        chatSocket.onclose = function (e) {
        console.error('Chat socket closed unexpectedly' + e);
        };
    }
    }, [chatSocket, user]);

    function handleChatMessageChange(event) {
        setChatMessage(event.target.value);
    }

    function handleFetch(event) {
        event.preventDefault();
        if (chatSocket) {
            chatSocket.send(
            JSON.stringify({
                message: chatMessage,
                command: 'fetch_messages',
                author: user.user_id,
                recipient: 10,
            })
            );
        }
    }
    
    function handleTest (event) {
        console.log(friends);
    }
    
    function handleChatMessageSubmit(event) {
        event.preventDefault();
            if (chatSocket) {
                chatSocket.send(
                JSON.stringify({
                    message: chatMessage,
                    command: 'new_message',
                    author: user.user_id,
                    recipient: 10,
                })
                );
        }
        setChatMessage('');
    }

    function handleFriendSelect(recipientId) {
        console.log(recipientId);
        // setChatSocket((socket) => {
        //     if (socket) {
        //     socket.send(
        //         JSON.stringify({
        //         command: 'switch_recipient',
        //         author: user.user_id,
        //         recipient: recipientId,
        //         })
        //     );
        //     setChatLog('');
        //     }
        //     return socket;
        // });
    }

    if (!user) {
    return <Navigate to="/login" />;
    }

    return (
    <div>
        <Navbar />
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <List sx={{ maxWidth: '100%' }}>
                {friends && friends.map((friend) => (
                <ListItem key={friend.id} onClick={() => handleFriendSelect(friend.id)}>
                    <ListItemText primary={friend.name} />
                </ListItem>
                ))}
            </List>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box sx={{ width: '50%' }}>
                <Box
                sx={{
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    p: 2,
                    borderRadius: 1,
                    maxHeight: '60vh',
                    overflowY: 'scroll',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                }}
                >
                <pre>{chatLog}</pre>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <input
                    type="text"
                    placeholder="Type a message"
                    value={chatMessage}
                    onChange={handleChatMessageChange}
                    onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        handleChatMessageSubmit(event);
                    }
                    }}
                    sx={{ flexGrow: 1, p: 1, mr: 1 }}
                />
                <Button variant="contained" onClick={handleChatMessageSubmit}>
                    Send
                </Button>
                <Button variant="contained" onClick={handleFetch}>
                    Fetch
                </Button>
                <Button variant="contained" onClick={handleTest}>
                    Test
                </Button>
                </Box>
            </Box>
            </Box>
        </Box>
        </Box>
    </div>
    );
  
}

export default ChatRoom;
