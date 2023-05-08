import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Grid, Paper, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import Pusher from "pusher-js";
import Navbar from "../Components/navbar";
import AuthContext from "../context/AuthContext";
import { API_ENDPOINT } from "../Components/api";

function ChatRoom() {

    const [username, setUsername] = useState('username');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const { user } = useContext(AuthContext);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [room, setRoom] = useState(null)
    
  
    useEffect(() => {
        if (!selectedFriend) {
          return;
        }
    
        setMessages([]);
    
        fetch(`${API_ENDPOINT}/chat/messages/${user.user_id}/${selectedFriend.id}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            setMessages(data);
          })
          .catch((error) => console.log(error));
      }, [selectedFriend]);


    useEffect(() => {
  
      fetch(`${API_ENDPOINT}/friends-list/${user.user_id}`)
        .then((response) => response.json())
        .then((data) => {
            setFriends(data.friends)
        })
        .catch((error) => console.log(error));
    }, [user.user_id]);


    useEffect(() => {
        const pusher = new Pusher('9ada003d3013120698bb', {
            cluster: 'us2'
        });

        if (room) {
            const channel = pusher.subscribe(room);
            channel.bind('message', function(data) {
                const isDuplicate = messages.some(msg => msg.id === data.id);
                if (!isDuplicate) {
                    setMessages(prevMessages => [...prevMessages, data]);
                }
            });
            
            return () => {
                channel.unbind_all();
                channel.unsubscribe();
            };
        }

    }, [room]);

    const handleSubmit = async e => {
        e.preventDefault();

        await fetch(`${API_ENDPOINT}/chat/messages`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                message,
                author: user.user_id,
                recipient: selectedFriend.id
            })
        });

        setMessage('');
    }

    const handleFriendClick = friend => {

        const author_id = user.user_id;
        const recipient_id = friend.id;

        if (author_id < recipient_id) {
            setRoom(`User_${author_id}_Room_User_${recipient_id}`);
        } else {
            setRoom(`User_${recipient_id}_Room_User_${author_id}`);
        }

        setSelectedFriend(friend);
    }

    if (!user) {
        return <Navigate to="/login" />;
      }

    console.log(user);
    return (
        <div>
            <Navbar />
            <Grid container component={Paper} style={{ height: '80vh' }} padding={2}>
                <Grid item xs={12} >
                <List>
                    {friends ? friends.map((friend, index) => (
                    <ListItem 
                        key={index} 
                        button 
                        selected={friend.id === selectedFriend?.id} 
                        onClick={() => handleFriendClick(friend)}
                    >
                        <ListItemText
                        secondary={friend.name}
                        />
                    </ListItem>
                    )) : null}
                </List>
                </Grid>
                <Grid item xs={12} style={{ height: '60vh', overflowY: 'auto' }}>
                    <List>
                    {messages.map((message, index) => (
                        <ListItem key={index}>
                        <ListItemText
                            primary={message.username}
                            secondary={message.message}
                        />
                        </ListItem>
                    ))}
                    </List>
                </Grid>
                <Grid item xs={10} style={{ height: '10vh' }}>
                    <form onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={8}>
                        <TextField
                            variant="outlined"
                            label="Message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            fullWidth
                        />
                        </Grid>
                        <Grid item xs={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                        >
                            Send
                        </Button>
                        </Grid>
                    </Grid>
                    </form>
                </Grid>
            </Grid>
            
        </div>
    );
  
}

export default ChatRoom;
