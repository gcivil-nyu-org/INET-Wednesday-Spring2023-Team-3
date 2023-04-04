import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../Components/navbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Media, Video } from "@vidstack/player-react";

import { API_ENDPOINT } from "../Components/api";

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
  console.log(answerData);

  return (
    <>
      <Navbar />

      <Box
        sx={{
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 8,
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
    </>
  );
}

export default AnswerDetails;
