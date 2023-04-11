import { useEffect, useState, useContext } from "react";

import { Button, Comment, Form, Header } from "semantic-ui-react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";

import { API_ENDPOINT } from "../Components/api";
import AuthContext from "../context/AuthContext";

function AnswerComments({ answerId }) {
  const { user } = useContext(AuthContext);
  const [commentData, setCommentData] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

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
          newCommentData.push({
            username: data.fields.username,
            created_at: data.fields.created_at,
            rating: data.fields.rating,
            text: data.fields.text,
          });
        });
        console.log(newCommentData);
        setCommentData(newCommentData);
      })
      .catch((error) => console.error(error));
  }, [answerId]);

  const handleAddComment = () => {
    if (newComment.length === 0) {
      alert("Cannot submit empty comment");
      return;
    }
    if (rating === 0) {
      alert("Please give a rating");
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
        let newCommentData = [
          ...commentData,
          {
            username: user.username,
            created_at: "now",
            rating: rating,
            text: newComment,
          },
        ];
        setCommentData(newCommentData);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Comment.Group>
      <Header as="h3" dividing style={{ width: "100%" }}>
        Comments
      </Header>

      {commentData.map((comment) => {
        console.log(comment);
        return (
          <Comment>
            <Comment.Content>
              <Comment.Author>{comment.username}</Comment.Author>
              <Comment.Metadata>
                <div>{comment.created_at}</div>
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
  );
}

export default AnswerComments;
