import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { ReactMediaRecorder } from "react-media-recorder";
import MonacoEditor from "@uiw/react-monacoeditor";
import Select from "@mui/material/Select";
const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  if (!stream) {
    return null;
  }
  return <video ref={videoRef} width={700} height={600} autoPlay controls />;
};

function MockInterview() {
  const location = useLocation();
  const [userConfig, setUserConfig] = useState(location.state);
  const [language, setLanguage] = useState("python");
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const [starterCode, setStarterCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState("");
  const editorRef = useRef(null);

  const editorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    console.log("editorDidMount", editor);
    editor.focus();
  };
  function clearCode() {
    setStarterCode("Write code here");
  }
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  // Helper function to validate JSON
  const validateJson = (json) => {
    try {
      JSON.stringify(json);
      return true;
    } catch (error) {
      return false;
    }
  };
  const compileCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const val = editorRef.current.getValue();
    try {
      const versionIndex = 0;

      const inputParams = {
        script: val,
        language: "python3",
        versionIndex: versionIndex,
      };

      // Validate request body as JSON
      const isValidJson = validateJson(inputParams);
      if (!isValidJson) {
        throw new Error("Invalid request body. Please check your input.");
      }

      const resp = await fetch(`${API_ENDPOINT}/codinganswers/submission`, {
        method: "POST",
        body: JSON.stringify(inputParams),
        headers: { "Content-type": "application/json" },
      });

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error_msg);
      }

      const data = await resp.json();
      console.log("Response:", data);
      setOutput(data);
      // Handle successful response here
    } catch (error) {
      setError(error.message);
      console.log(error);
    }

    setIsSubmitting(false);
  };

  const [codingCntr, setCodingCntr] = useState(
    userConfig.number_of_coding_questions
  );
  const [behaviouralCntr, setBehaviouralCntr] = useState(
    userConfig.number_of_behavioural_questions
  );

  // let codingCntr = userConfig.number_of_coding_questions;
  // let behaviouralCntr = userConfig.number_of_behavioural_questions;

  const [timer, setTimer] = useState(userConfig.time_limit * 60);
  const [isActive, setIsActive] = useState(false);
  const [swapVisible, setSwapVisible] = useState(false);

  const [codingQuestions, setCodingQuestions] = useState([]);
  const [behaviouralQuestions, setBehaviouralQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState({
    fields: { title: "Hello!", description: "Click on start to begin." },
  });

  let codingURL =
    `${API_ENDPOINT}/questions/mock-interview/?type=Coding&company=` +
    userConfig.selectedCompany +
    `&position=` +
    userConfig.selectedPosition;
  let behaviouralURL =
    `${API_ENDPOINT}/questions/mock-interview/?type=Behavioural&company=` +
    userConfig.selectedCompany +
    `&position=` +
    userConfig.selectedPosition;

  useEffect(() => {
    setUserConfig(location.state);
  }, [location.state]);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const fetchCodingQuestions = async () => {
    try {
      const response = await fetch(codingURL);
      const data = await response.json();
      setCodingQuestions(data.question_data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBehaviouralQuestions = async () => {
    try {
      const response = await fetch(behaviouralURL);
      const data = await response.json();
      setBehaviouralQuestions(data.question_data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBehaviouralQuestions();
  }, [behaviouralURL]);

  useEffect(() => {
    fetchCodingQuestions();
  }, [codingURL]);

  const nextQuestion = () => {
    setSwapVisible(true);
    console.log(
      "next: " + behaviouralCntr,
      codingCntr,
      behaviouralCntr > 0,
      behaviouralQuestions.length === 0
    );

    if (behaviouralCntr > 0) {
      setBehaviouralCntr(behaviouralCntr - 1);
      // behaviouralCntr -= 1;
    } else if (codingCntr > 0) {
      console.log("cntr before reduced:" + codingCntr);
      setCodingCntr(codingCntr - 1);
      // codingCntr -= 1;
      console.log("cntr reduced:" + codingCntr);
    }
    populateQuestion();
  };

  const populateQuestion = () => {
    console.log(
      behaviouralCntr,
      codingCntr,
      behaviouralCntr > 0,
      behaviouralQuestions.length === 0
    );

    if (behaviouralCntr > 0) {
      if (behaviouralQuestions.length === 0) {
        setBehaviouralCntr(0);
        // behaviouralCntr = 0;
        setActiveQuestion({
          fields: {
            title: "Sorry",
            description: "Behavioural questions depleted",
          },
        });
        setSwapVisible(false);
      } else {
        let temp = behaviouralQuestions.shift();
        setActiveQuestion(temp);
      }
    } else if (codingCntr > 0) {
      if (codingQuestions.length === 0) {
        setCodingCntr(0);
        // codingCntr = 0;
        setActiveQuestion({
          fields: { title: "Sorry", description: "Coding questions depleted" },
        });
        setSwapVisible(false);
      } else {
        let temp = codingQuestions.shift();
        setActiveQuestion(temp);
      }
    } else {
      setActiveQuestion({ fields: { title: "Complete!", description: "" } });
      resetTimer();
    }
  };

  const startTimer = () => {
    populateQuestion();
    setIsActive(true);
    setSwapVisible(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimer(userConfig.time_limit * 60);
    fetchCodingQuestions();
    fetchBehaviouralQuestions();
    setCodingCntr(userConfig.number_of_coding_questions);
    // codingCntr = userConfig.number_of_coding_questions
    setBehaviouralCntr(userConfig.number_of_behavioural_questions);
    // behaviouralCntr = userConfig.number_of_behavioural_questions;
    setActiveQuestion({
      fields: {
        title: "Complete!",
        description: "Click on start to start another interview.",
      },
    });
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Mock Interview
        </Typography>
        <Typography>
          Time Limit: {formatTime(timer)}{" "}
          {!isActive && <Button onClick={startTimer}>Start</Button>}{" "}
          {isActive && <Button onClick={resetTimer}>Reset</Button>}
        </Typography>
      </Box>
      <Box sx={{ marginTop: 2 }} style={{ marginTop: 30 }}>
        <Stack direction="row" spacing={3}>
          <div
            style={{
              backgroundColor: "#ebebeb",
              width: "45vw",
              height: "65vh",
              padding: 20,
              borderRadius: "15px",
            }}
          >
            <Typography variant="h5" gutterBottom>
              {activeQuestion.fields && activeQuestion.fields.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {activeQuestion.fields && activeQuestion.fields.description}
            </Typography>
          </div>
          <div>
            <ReactMediaRecorder
              video
              blobPropertyBag={{
                type: "video/webm",
              }}
              // askPermissionOnMount={true}
              render={({
                previewStream,
                status,
                startRecording,
                stopRecording,
                mediaBlobUrl,
              }) => {
                return (
                  <div>
                    <Stack direction="row" spacing={1}>
                      <Button onClick={nextQuestion}>Next</Button>
                      {swapVisible ? (
                        <Button onClick={populateQuestion}>Swap</Button>
                      ) : null}
                      <Button
                        variant="outlined"
                        onClick={startRecording}
                        style={{
                          textTransform: "none",
                          color: "#C01C63",
                          borderColor: "#C01C63",
                        }}
                      >
                        Start Recording
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={stopRecording}
                        style={{
                          textTransform: "none",
                        }}
                      >
                        Stop Recording
                      </Button>
                      <Chip
                        label={"Video status: " + status}
                        variant="outlined"
                        style={{
                          marginTop: 2,
                        }}
                      />
                    </Stack>
                    {/* <audio src={mediaBlobUrl} controls autoPlay loop /> */}

                    {status === "stopped" && (
                      <video
                        src={mediaBlobUrl}
                        controls
                        style={{ width: "40vw", marginTop: "20px" }}
                      />
                    )}

                    {status !== "stopped" && (
                      <VideoPreview stream={previewStream} />
                    )}
                  </div>
                );
              }}
            />
          </div>
        </Stack>
      </Box>
      <div
        style={{
          height: "800px",
          width: "96vw",
          marginTop: "20px",
          marginBottom: "20px",
          padding: "20px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Write your code here:
        </Typography>
        <Box sx={{ marginTop: 2 }} style={{ marginTop: 30, marginBottom: 30 }}>
          <Stack direction="row" spacing={1}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "flex-start" }}
            >
              <FormControl style={{ width: "10vw" }}>
                <InputLabel id="demo-simple-select-label">language</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={language}
                  label="language"
                  onChange={handleLanguageChange}
                >
                  <MenuItem value={"python"}>python</MenuItem>
                  <MenuItem value={"c"}>c</MenuItem>
                  <MenuItem value={"java"}>java</MenuItem>
                  <MenuItem value={"javascript"}>javascript</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                onClick={compileCode}
                style={{
                  textTransform: "none",
                }}
              >
                {isSubmitting ? "Compiling..." : "Run"}
              </Button>
              <Button
                variant="outlined"
                onClick={clearCode}
                style={{
                  textTransform: "none",
                }}
              >
                Clear
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ marginTop: 2 }} style={{ marginTop: 30 }}>
          <Grid container spacing={2} columns={16}>
            <Grid xs={8} style={{ fontSize: 24 }}>
              <Typography variant="h5" gutterBottom>
                Language : {language}
              </Typography>

              <Item style={{ marginTop: "30px", textAlign: "left" }}>
                {" "}
                <MonacoEditor
                  language={language}
                  height="60vh"
                  options={{
                    theme: "vs-dark",
                    selectOnLineNumbers: true,
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "left",
                  }}
                  value={starterCode}
                  editorDidMount={editorDidMount}
                />
              </Item>
            </Grid>
            <Grid xs={8} style={{ fontSize: 24 }}>
              <Typography variant="h5" gutterBottom>
                Output:
              </Typography>
              <Item
                style={{
                  marginTop: "30px",
                  textAlign: "left",
                  backgroundColor: "#000000",
                  height: "62vh",
                }}
              >
                <Box
                  sx={{ marginTop: 2 }}
                  style={{ marginTop: 30, marginBottom: 30 }}
                >
                  <Stack
                    direction="column"
                    spacing={2}
                    sx={{ justifyContent: "flex-end" }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ justifyContent: "flex-start" }}
                    >
                      <Typography
                        variant="h5"
                        style={{ color: "#eff2f699" }}
                        gutterBottom
                      >
                        CPUtime: {output.cpuTime} sec
                      </Typography>
                      <Typography
                        variant="h5"
                        style={{ color: "#eff2f699" }}
                        gutterBottom
                      >
                        Memory: {output.memory} kb
                      </Typography>
                    </Stack>
                    <Typography
                      variant="h5"
                      style={{ color: "#eff2f699" }}
                      gutterBottom
                    >
                      Output
                    </Typography>
                    <Typography
                      variant="p"
                      style={{
                        color: "#fff",
                        backgroundColor: "#808080",
                        borderRadius: "10px",
                        padding: "10px",
                      }}
                      gutterBottom
                    >
                      [{output.output}]
                    </Typography>
                  </Stack>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default MockInterview;
