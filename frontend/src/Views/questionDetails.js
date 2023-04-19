import * as React from "react";
import { useRef, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import TextareaAutosize from "@mui/base/TextareaAutosize";

import { ReactMediaRecorder } from "react-media-recorder";
import MonacoEditor from "@uiw/react-monacoeditor";

import Navbar from "../Components/navbar";
import UploadVideoButton from "../Components/uploadVideoButtom";
import { API_ENDPOINT } from "../Components/api";
import AuthContext from "../context/AuthContext";
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

function QuestionDetails() {
  const { pk } = useParams();
  const [question, setQuestion] = useState({});

  useEffect(() => {
    const url = `${API_ENDPOINT}/questions/get-questions/?q_id=${pk}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setQuestion(data.question_data[0].fields);
      })
      .catch((error) => console.error(error));
  }, [pk]);

  const [language, setLanguage] = useState("python");
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const [starterCode, setStarterCode] = useState("");
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const noneUser = -1;
  useEffect(() => {
    const fetchStarterCode = async () => {
      try {
        let endpoint = "";
        if (user) {
          endpoint = `${API_ENDPOINT}/codinganswers/get-starter-code/?user=${user.user_id}&language=${language}&question=${pk}`;
        } else {
          endpoint = `${API_ENDPOINT}/codinganswers/get-starter-code/?user=${noneUser}&language=${language}&question=${pk}`;
        }

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 200) {
            setStarterCode(data.starter_code);
            setError("");
          } else {
            setError(data.error_msg);
          }
        } else {
          setError("Error: Failed to fetch starter code");
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      }
    };

    fetchStarterCode();
  }, [user, language, pk]);

  const submitCode = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const requestBody = {
        user: user.user_id,
        question: pk,
        submission: starterCode,
        language,
      };

      // Validate request body as JSON
      const isValidJson = validateJson(requestBody);
      if (!isValidJson) {
        throw new Error("Invalid request body. Please check your input.");
      }

      const response = await fetch(
        `${API_ENDPOINT}/codinganswers/post-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error_msg);
      }

      const data = await response.json();
      console.log("Response:", data);
      // Handle successful response here
    } catch (error) {
      setError(error.message);
    }
  };

  // Helper function to validate JSON
  const validateJson = (json) => {
    try {
      JSON.stringify(json);
      return true;
    } catch (error) {
      return false;
    }
  };

  function handleEditorChange(value, event) {
    setStarterCode(value);
    console.log(value);
  }
  function clearCode() {
    setStarterCode("");
  }
  let navigate = useNavigate();
  const routeChange = () => {
    navigate(`/answers/${pk}`);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState("");
  const compileCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const versionIndex = 0;

      const inputParams = {
        script: editorRef.current.getValue(),
        language: "python3",
        versionIndex: versionIndex,
      };

      // Validate request body as JSON
      const isValidJson = validateJson(inputParams);
      if (!isValidJson) {
        throw new Error("Invalid request body. Please check your input.");
      }

      const resp = await fetch(
        `${API_ENDPOINT}/codinganswers/submission`,
        {
          method: "POST",
          body: JSON.stringify(inputParams),
          headers: { "Content-type": "application/json" },
        }
      );

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

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {question.title}
        </Typography>

        <Stack direction="row" spacing={1}>
          {question.type === "Behavioural" ? (
            <Chip
              label={question.type}
              variant="outlined"
              style={{ color: "#454AE5", borderColor: "#454AE5" }}
            />
          ) : (
            <Chip
              label="Coding"
              variant="outlined"
              style={{ color: "#C01C63", borderColor: "#C01C63" }}
            />
          )}
          {question.difficulty === "Easy" ? (
            <Chip
              label={question.difficulty}
              style={{ color: "#FFFFFF", backgroundColor: "#50ecb3" }}
            />
          ) : question.difficulty === "Medium" ? (
            <Chip
              label={question.difficulty}
              style={{ color: "#FFFFFF", backgroundColor: "#94d3c5" }}
            />
          ) : question.difficulty === "Hard" ? (
            <Chip
              label={question.difficulty}
              style={{ color: "#FFFFFF", backgroundColor: "#41a9b6" }}
            />
          ) : question.difficulty === "Expert" ? (
            <Chip
              label={question.difficulty}
              style={{ color: "#FFFFFF", backgroundColor: "#276e72" }}
            />
          ) : question.difficulty === "Beginner" ? (
            <Chip
              label={question.difficulty}
              style={{ color: "#FFFFFF", backgroundColor: "#276e72" }}
            />
          ) : (
            <></>
          )}
          {question.companies && question.companies.length !== 0 && (
            <Divider orientation="vertical" flexItem />
          )}
          {question.companies &&
            question.companies.length !== 0 &&
            question.companies
              .split(",")
              .map((company) => (
                <Chip id={company} label={company} style={{ marginLeft: 10 }} />
              ))}
          {question.positions && question.positions.length !== 0 && (
            <Divider orientation="vertical" flexItem />
          )}
          {question.positions &&
            question.positions.length !== 0 &&
            question.positions
              .split(",")
              .map((position) => (
                <Chip
                  id={position}
                  label={position}
                  style={{ marginLeft: 10 }}
                />
              ))}
        </Stack>

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
                Description:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {question.description}
              </Typography>
            </div>

            {question.type === "Coding" && (
              <div>
                <ReactMediaRecorder
                  screen
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
                          <Button
                            variant="outlined"
                            onClick={startRecording}
                            style={{
                              textTransform: "none",
                              color: "#C01C63",
                              borderColor: "#C01C63",
                            }}
                          >
                            Start Recording Screen
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
                          <UploadVideoButton questionId={pk} />
                          <Chip
                            label={"Video status: " + status}
                            variant="outlined"
                            style={{
                              marginTop: 2,
                            }}
                          />
                        </Stack>
                        {/* <audio src={mediaBlobUrl} controls autoPlay loop /> */}
                        <video
                          src={mediaBlobUrl}
                          controls
                          style={{ width: "48vw", marginTop: "20px" }}
                        />
                        <Button
                          variant="outlined"
                          style={{
                            textTransform: "none",
                            marginTop: "20px",
                          }}
                          onClick={routeChange}
                        >
                          See all solutions
                        </Button>
                      </div>
                    );
                  }}
                />
              </div>
            )}
            {question.type === "Behavioural" && (
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
                          <UploadVideoButton questionId={pk} />
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
                        <Box>
                          <Button
                            variant="outlined"
                            style={{
                              textTransform: "none",
                              marginTop: "20px",
                            }}
                            onClick={routeChange}
                          >
                            See all solutions
                          </Button>
                        </Box>
                      </div>
                    );
                  }}
                />
              </div>
            )}
          </Stack>
        </Box>
      </Box>
      {question.type === "Coding" && (
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
          <Box
            sx={{ marginTop: 2 }}
            style={{ marginTop: 30, marginBottom: 30 }}
          >
            <Stack direction="row" spacing={1}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ justifyContent: "flex-start" }}
              >
                <FormControl style={{ width: "10vw" }}>
                  <InputLabel id="demo-simple-select-label">
                    language
                  </InputLabel>
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
                  onClick={submitCode}
                  style={{
                    textTransform: "none",
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={submitCode}
                  style={{
                    textTransform: "none",
                  }}
                >
                  Compile
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
                {language}
                <Item style={{marginTop: "30px", textAlign:"left"}}>
                  {" "}
                  <MonacoEditor
                    value={starterCode}
                    language={language}
                    height="60vh"
                    options={{
                      theme: "vs-dark",
                    }}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "left",
                    }}
                    onChange={handleEditorChange}
                  />
                </Item>
              </Grid>
              <Grid xs={8} style={{ fontSize: 24 }}>
                Output
                <Item style={{marginTop: "30px", textAlign:"left"}}>
                  <TextareaAutosize
                    maxRows={8}
                    aria-label="maximum height"
                    placeholder="Maximum 4 rows"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua."
                    style={{
                      width: 500,
                      height: "60vh",
                      borderSyle: "none",
                      borderColor: "Transparent",
                      overflow: "auto",
                      outline: "none",
                      resize: "none"
                    }}
                    readOnly
                    spellCheck={false}
                  />
                </Item>
              </Grid>
            </Grid>
          </Box>
        </div>
      )}
    </>
  );
}

export default QuestionDetails;
