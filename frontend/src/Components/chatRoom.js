import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Pusher from "pusher-js";
import Navbar from "../Components/navbar";
import AuthContext from "../context/AuthContext";
import { API_ENDPOINT } from "../Components/api";
import Divider from "@mui/material/Divider";
import SendIcon from "@mui/icons-material/Send";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { makeStyles } from '@mui/styles';
import CssBaseline from "@mui/material/CssBaseline";
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
    margin: "20px",
    
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },

  textRight: {
    textAlign: "right",
  },
  textLeft: {
    textAlign: "left",
  },

  chatBubbleLeft: {
    display: "inline-block",
    position: "relative",
    marginLeft: "10px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#f2f2f2",
    color:"#000000",
    borderRadius: "5px",
    maxWidth: "80%",
    textAlign: "left",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "-10px",
      borderStyle: "solid",
      borderWidth: "10px 15px 10px 0",
      borderColor: "transparent #f2f2f2 transparent transparent",
      transform: "translateY(-50%)",
    },
  },
  chatBubbleRight: {
    display: "inline-block",
    position: "relative",
    marginRight: "10px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    maxWidth: "80%",
    textAlign: "left",
    "&:before": {
      content: '""',
      position: "absolute",
      top: "50%",
      right: "-10px",
      borderStyle: "solid",
      borderWidth: "10px 0 10px 15px",
      borderColor: "transparent transparent transparent #007bff",
      transform: "translateY(-50%)",
    },
    marginLeft: "90%",
  },
});
function ChatRoom() {
  const classes = useStyles();
  const [username, setUsername] = useState("username");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!selectedFriend) {
      return;
    }

    setMessages([]);

    fetch(`${API_ENDPOINT}/chat/messages/${user.user_id}/${selectedFriend.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessages(data);
      })
      .catch((error) => console.log(error));
  }, [selectedFriend]);

  useEffect(() => {
    fetch(`${API_ENDPOINT}/friends-list/${user.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        setFriends(data.friends);
      })
      .catch((error) => console.log(error));
  }, [user.user_id]);

  useEffect(() => {
    const pusher = new Pusher("9ada003d3013120698bb", {
      cluster: "us2",
    });

    if (room) {
      const channel = pusher.subscribe(room);
      channel.bind("message", function (data) {
        const isDuplicate = messages.some((msg) => msg.id === data.id);
        if (!isDuplicate) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      });

      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
    }
  }, [room]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_ENDPOINT}/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        message,
        author: user.user_id,
        recipient: selectedFriend.id,
      }),
    });

    setMessage("");
  };

  const handleFriendClick = (friend) => {
    const author_id = user.user_id;
    const recipient_id = friend.id;

    if (author_id < recipient_id) {
      setRoom(`User_${author_id}_Room_User_${recipient_id}`);
    } else {
      setRoom(`User_${recipient_id}_Room_User_${author_id}`);
    }

    setSelectedFriend(friend);
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  console.log(user);

  return (
    <div style={{backgroundColor: "#D3D3D3" }}>
      <Navbar />
      <ThemeProvider theme={darkTheme}>
        <Grid style={{ margin: "30px" }} container>
          <Grid item xs={12}>
          <Typography
              variant="h4"
              component="div"
              sx={{ flexGrow: 1, color: "#57068c" }}
            >
              Chat Room
            </Typography>
          </Grid>
        </Grid>

        <Grid container component={Paper} className={classes.chatSection}>
          <Grid item xs={3} className={classes.borderRight500}>
            <List>
              {friends
                ? friends.map((friend, index) => (
                    <>
                      <ListItem
                        key={index}
                        button
                        selected={friend.id === selectedFriend?.id}
                        onClick={() => handleFriendClick(friend)}
                      >
                        <ListItemText secondary={friend.name} />
                      </ListItem>
                      <Divider />
                    </>
                  ))
                : null}
            </List>
          </Grid>

          <Grid item xs={9}>
            <List className={classes.messageArea}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        className={
                          message.username === messages[0].username
                            ? classes.textRight
                            : classes.textLeft
                        }
                        primary={message.username}
                      />
                      <ListItemText
                        className={
                          message.username === messages[0].username
                            ? classes.chatBubbleRight
                            : classes.chatBubbleLeft
                        }
                        primary={message.message}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>

            <Divider />
            <Grid container style={{ padding: "20px" }} alignItems="center">
              <Grid item xs={11}>
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <TextField
                    variant="outlined"
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "50px", height: "50px" }}
                    type="submit"
                  >
                    Send <SendIcon style={{ marginLeft: "20px" }} />
                  </Button>
                </form>
              </Grid>
            </Grid>

            <Grid item xs={1}></Grid>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default ChatRoom;
