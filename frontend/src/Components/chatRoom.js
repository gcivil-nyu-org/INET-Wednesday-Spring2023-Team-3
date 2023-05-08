import { useState, useEffect } from 'react';
import { Grid, Paper, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import Pusher from "pusher-js";
import Navbar from "../Components/navbar";

function ChatRoom() {

    const [username, setUsername] = useState('username');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const pusher = new Pusher('9ada003d3013120698bb', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe('chat');
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

    }, []);

    const handleSubmit = async e => {
        e.preventDefault();

        await fetch('http://localhost:8000/chat/messages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username,
                message
            })
        });

        setMessage('');
    }

    return (
        <div>
            <Navbar />
            <Grid container component={Paper} style={{ height: '80vh' }} padding={2}>
            <Grid item xs={12} style={{ height: '10vh' }}>
                <TextField
                variant="outlined"
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                fullWidth
                />
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
            <Grid item xs={12} style={{ height: '10vh' }}>
                <form onSubmit={handleSubmit}>
                <Grid container>
                    <Grid item xs={10}>
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
