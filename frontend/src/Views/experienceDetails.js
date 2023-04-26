import { useParams } from "react-router-dom";
import Navbar from "../Components/navbar";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { API_ENDPOINT } from "../Components/api";
import ExperienceComments from "../Components/experienceComments";

function ExperienceDetails() {
  const { pk, author } = useParams();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    const url = `${API_ENDPOINT}/experiences/post_experience/${pk}/`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.exp_title);
        setText(data.exp_text);
        setImg(data.img_file);
        setCreatedAt(data.created_at);
      })
      .catch((error) => console.error(error));
  }, [pk]);

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 2, marginLeft: 3 }}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h7" gutterBottom>
          {createdAt.slice(0, 10)} | Author: {author}
        </Typography>
        <Typography variant="body1" gutterBottom style={{ marginTop: 20 }}>
          {text}
        </Typography>
        {img && (
          <img src={img} style={{ marginTop: 10 }} alt={"Attached img"} />
        )}

        <ExperienceComments experienceID={pk} />
      </Box>
    </>
  );
}
export default ExperienceDetails;
