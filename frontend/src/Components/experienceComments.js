import { useEffect, useState, useContext } from "react";
import * as React from "react";
import { Link } from "react-router-dom";

import { Button, Comment, Form, Header } from "semantic-ui-react";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

import { API_ENDPOINT } from "./api";
import AuthContext from "../context/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function ExperienceComments({ experienceID }) {
  const { user } = useContext(AuthContext);
  const [commentData, setCommentData] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("success");
  const [alertMessage, setAlertMessage] = useState("Upload successful");

  useEffect(() => {
    const url = `${API_ENDPOINT}/experiences/get_comments/${experienceID}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let newCommentData = [];
        data.comment_data.map((data) => {
          return newCommentData.push({
            username: data.fields.username,
            created_at: data.fields.created_at,
            text: data.fields.text,
            email: data.fields.email,
          });
        });
        setCommentData(newCommentData);
      })
      .catch((error) => console.error(error));
  }, [experienceID]);

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
    fetch(`${API_ENDPOINT}/experiences/post_comment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        experience: experienceID,
        text: newComment,
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
              <Comment.Content>
                <Link to={`/profile/${comment.email}`}>
                  <Comment.Author as="a">{comment.username}</Comment.Author>
                </Link>
                <Comment.Metadata>
                  <div>{comment.created_at.slice(0, 10)}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.text}</Comment.Text>
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

export default ExperienceComments;
