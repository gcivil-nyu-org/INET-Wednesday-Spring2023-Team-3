import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Navbar from "./navbar";

function QuestionDetails() {
  const { pk } = useParams();
  const [question, setQuestion] = useState({});

  useEffect(() => {
    const url = `https://nyuprepapi.com/api/questions/?q_id=${pk}`;
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data.question_data[0].fields)
    })
      .catch((error) => console.error(error))
    
  }, [pk]);

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {question.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Type: {question.type}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Difficulty: {question.difficulty}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Companies: {question.companies}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Positions:{question.positions}
        </Typography>
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Description:
          </Typography>
          <Typography variant="body1" gutterBottom>
            {question.description}
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default QuestionDetails;