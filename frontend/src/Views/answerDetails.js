import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Media, Video } from "@vidstack/player-react";

import { API_ENDPOINT } from "../Components/api";
import AnswerComments from "../Components/answerComments";
import Navbar from "../Components/navbar";

function AnswerDetails() {
  const { answer_id } = useParams();
  const [answerData, setAnswerData] = useState([]);

  useEffect(() => {
    const url = `${API_ENDPOINT}/answerrecording/${answer_id}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setAnswerData(data);
      })
      .catch((error) => console.error(error));
  }, [answer_id]);

  return (
    <>
      <Navbar />

      <Box
        sx={{
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 2,
          paddingBottom: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          {answerData.title}
        </Typography>
        <Typography variant="h7" gutterBottom>
          {answerData.created_at}
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Media style={{ marginTop: "50px" }}>
            <Video controls>
              <video
                src={answerData.file}
                preload="none"
                data-video="0"
                controls
              />
            </Video>
          </Media>
        </Box>
      </Box>
      <Box
        sx={{
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 2,
          paddingBottom: 8,
        }}
      >
        <AnswerComments answerId={answer_id} />
      </Box>
    </>
  );
}

export default AnswerDetails;
