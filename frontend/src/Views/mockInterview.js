import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

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

import { ReactMediaRecorder } from "react-media-recorder";
import MonacoEditor from "@uiw/react-monacoeditor";

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

    const [codingCntr, setCodingCntr ] = useState(userConfig.number_of_coding_questions);
    const [behaviouralCntr, setBehaviouralCntr ] = useState(userConfig.number_of_behavioural_questions);

    const [timer, setTimer] = useState(userConfig.time_limit * 60);
    const [isActive, setIsActive] = useState(false);
    const [swapVisible, setSwapVisible] = useState(false);

    const [codingQuestions, setCodingQuestions] = useState([]);
    const [behaviouralQuestions, setBehaviouralQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState([]);


    let codingURL = `${API_ENDPOINT}/questions/mock-interview/?type=Coding&company=` + userConfig.selectedCompany + `&position=` + userConfig.selectedPosition;
    let behaviouralURL = `${API_ENDPOINT}/questions/mock-interview/?type=Behavioural&company=` + userConfig.selectedCompany + `&position=` + userConfig.selectedPosition;

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

        if (behaviouralCntr > 0) {
            setBehaviouralCntr(behaviouralCntr - 1);
        } else if (codingCntr > 0) {
            setCodingCntr(codingCntr - 1);
        } 

        populateQuestion();
    }

    const populateQuestion = () => {

        if (behaviouralCntr > 0) {
            if (behaviouralQuestions.length == 0) {
                setBehaviouralCntr(0);
                setActiveQuestion({fields: {title: "Sorry", description: "Behavioural questions depleted"}});
                setSwapVisible(false);
            } else {
                let temp = behaviouralQuestions.shift();
                setActiveQuestion(temp);
            }
        } else if (codingCntr > 0) {
            if (codingQuestions.length == 0) {
                setCodingCntr(0);
                setActiveQuestion({fields: {title: "Sorry", description: "Coding questions depleted"}});
                setSwapVisible(false);
            } else {
                let temp = codingQuestions.shift();
                setActiveQuestion(temp);
            }
        } else {
            setActiveQuestion({fields: {title: "Complete!", description: ""}});
            resetTimer();
        }
    }

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
        setBehaviouralCntr(userConfig.number_of_behavioural_questions);
        setActiveQuestion({fields: {}});
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
            {isActive ? (
            <>
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
                                <Button 
                                onClick={nextQuestion}
                                >
                                    Next
                                </Button>
                                {swapVisible ? 
                                    <Button 
                                    onClick={populateQuestion}
                                    >
                                    Swap
                                    </Button> 
                                    : null}
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
            </>
            ) : null}
        </div>
    );
}

export default MockInterview;
