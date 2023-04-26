import { useEffect, useState, useContext } from "react";
import * as React from "react";

import { Button, Comment, Form, Header } from "semantic-ui-react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

import { API_ENDPOINT } from "../Components/api";
import AuthContext from "../context/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AnswerComments({ answerId }) {
  const { user } = useContext(AuthContext);
  const [commentData, setCommentData] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("success");
  const [alertMessage, setAlertMessage] = useState("Upload successful");

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  useEffect(() => {
    const url = `${API_ENDPOINT}/get_comments/${answerId}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let newCommentData = [];
        data.comment_data.map((data) => {
          return newCommentData.push({
            username: data.fields.username,
            created_at: data.fields.created_at,
            rating: data.fields.rating,
            text: data.fields.text,
          });
        });
        setCommentData(newCommentData);
      })
      .catch((error) => console.error(error));
  }, [answerId]);

  const handleAddComment = () => {
    if (!user) {
      setOpenAlert(true);
      setAlertMessage("Please login first");
      setAlertStatus("error");
      return;
    }
    if (newComment.length === 0) {
      setOpenAlert(true);
      setAlertMessage("Cannot submit empty comment");
      setAlertStatus("error");
      return;
    }
    if (rating === 0) {
      setOpenAlert(true);
      setAlertMessage("Please give a rating");
      setAlertStatus("error");
      return;
    }
    fetch(`${API_ENDPOINT}/post_comment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: rating,
        text: newComment,
        answer: answerId,
        user: user.user_id,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        window.location.reload(false);
      })
      .catch((error) => console.error(error));
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => {
          setOpenAlert(false);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Divider style={{ marginTop: 20 }} />
      <Comment.Group>
        <Header as="h3" style={{ width: "100%" }}>
          Comments
        </Header>

        {commentData.map((comment) => {
          return (
            <Comment>
              <Comment.Avatar
                src={"https://i.pravatar.cc/" + Math.floor(Math.random() * 100)}
              />
              <Comment.Content>
                <Comment.Author as="a">{comment.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{comment.created_at.slice(0, 10)}</div>
                </Comment.Metadata>
                <Comment.Text>
                  <Chip
                    label={"Rating: " + comment.rating}
                    variant="outlined"
                    style={{
                      marginRight: 5,
                      color: "#57068c",
                      borderColor: "#57068c",
                    }}
                  />
                  {comment.text}
                </Comment.Text>
              </Comment.Content>
            </Comment>
          );
        })}

        <Form reply>
          <Form.TextArea
            onChange={(e) => {
              setNewComment(e.target.value);
            }}
          />
          <Stack direction={"row"}>
            <FormControl style={{ width: "200px" }}>
              <InputLabel id="rating-select-label">Rating</InputLabel>
              <Select
                labelId="rating-select-label"
                id="rating-simple-select"
                value={rating}
                label="Rating"
                onChange={handleRatingChange}
                style={{ marginRight: 10 }}
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
            <Button
              content="Add Comment"
              labelPosition="left"
              icon="edit"
              primary
              onClick={handleAddComment}
            />
          </Stack>
        </Form>
      </Comment.Group>

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        action={action}
        onClose={() => {
          setOpenAlert(false);
        }}
      >
        <Alert
          onClose={() => {
            setOpenAlert(false);
          }}
          severity={alertStatus}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AnswerComments;
