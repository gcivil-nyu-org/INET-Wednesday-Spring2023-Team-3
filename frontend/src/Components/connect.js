import React, { useState, useEffect, useContext } from "react";
import { Grid, Item, Box, List, ListItem, ListItemText, Button } from "@mui/material";
import Navbar from "./navbar";
import AuthContext from "../context/AuthContext";
import { API_ENDPOINT } from "../Components/api";

function Connect() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState(new Set());

  useEffect(() => {
    fetch(`${API_ENDPOINT}/search-users/`)
      .then((response) => response.json())
      .then((data) => setUsers(data.users))
      .catch((error) => console.log(error));

    fetch(`${API_ENDPOINT}/friends-list/${user.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        const friendsSet = new Set(data.friends.map((friend) => friend.id));
        setFriends(friendsSet);
      })
      .catch((error) => console.log(error));
  }, [user.user_id]);

  const handleAddFriend = (userId) => {
    fetch(`${API_ENDPOINT}/add-friend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id, friend_id: userId }),
    })
      .then(() => {
        setFriends(new Set([...friends, userId]));
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveFriend = (userId) => {
    fetch(`${API_ENDPOINT}/remove-friend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id, friend_id: userId }),
    })
      .then(() => {
        const newFriends = new Set(friends);
        newFriends.delete(userId);
        setFriends(newFriends);
      })
      .catch((error) => console.log(error));
  };

  const renderUser = (user) => {
    const isFriend = friends.has(user.id);
    return (
      <div>
      <Box padding={3}>
        <ListItem key={user.id}>
          <ListItemText primary={user.name} />
          <ListItemText primary={user.email} />
          {isFriend ? (
            <Button variant="contained" color="secondary" onClick={() => handleRemoveFriend(user.id)}>
              Remove friend
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => handleAddFriend(user.id)}>
              Add friend
            </Button>
          )}
        </ListItem>
      </Box>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <h2 padding={3}>Search Users</h2>
      <List>
        {users.map((user) => renderUser(user))}
      </List>
    </div>
  );
}

export default Connect;
