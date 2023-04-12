import React, { useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { API_ENDPOINT } from "../Components/api";
import AuthContext from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

import Navbar from "../Components/navbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UploadQuestion() {
  const { user } = useContext(AuthContext);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("success");
  const [alertMessage, setAlertMessage] = useState("Upload successful");

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseAlert}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companies: "",
    categories: "",
    difficulty: "",
    positions: "",
    type: "",
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(`${API_ENDPOINT}/questions/post-question/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setOpenAlert(true);
        setAlertMessage("Question has been uploaded successfully");
        setAlertStatus("success");
        console.log(data);
      })
      .catch((error) => {
        setOpenAlert(true);
        setAlertMessage("Fail to upload question");
        setAlertStatus("error");
        console.error(error);
      });
  };

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "50vw",
              marginTop: "2vh",
              marginBottom: "2vh",
              padding: 30,
            }}
          >
            <Box component="form">
              <Typography variant="h6">
                Please enter question's detail:
              </Typography>
              <div>
                <TextField
                  required
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  multiline
                  style={{ width: "100%", marginTop: 15 }}
                />
              </div>
              <div>
                <TextField
                  required
                  id="outlined-multiline-static"
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  style={{ width: "100%", marginTop: 15 }}
                />
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  component="h2"
                  style={{ marginTop: 15 }}
                >
                  * If you want to enter more than one value, connect them with
                  ","
                </Typography>
              </div>
              <div>
                <TextField
                  label="Company"
                  name="companies"
                  value={formData.companies}
                  onChange={handleInputChange}
                  style={{ width: "48%", marginTop: 15, marginRight: 15 }}
                />
                <TextField
                  label="Position"
                  name="positions"
                  value={formData.positions}
                  onChange={handleInputChange}
                  style={{ width: "48%", marginTop: 15, marginRight: 15 }}
                />
              </div>
              <div>
                <FormControl
                  fullWidth
                  style={{ width: "32%", marginTop: 15, marginRight: 15 }}
                >
                  <InputLabel id="difficulty-select-label">
                    Difficulty
                  </InputLabel>
                  <Select
                    labelId="difficulty-select-label"
                    id="difficulty-select"
                    label="Difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Not satisfied</MenuItem>
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Medium">Hard</MenuItem>
                    <MenuItem value="Expert">Expert</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  fullWidth
                  style={{ width: "32%", marginTop: 15, marginRight: 15 }}
                >
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-select"
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="">Not satisfied</MenuItem>
                    <MenuItem value="Coding">Coding</MenuItem>
                    <MenuItem value="Behavioural">Behavioural</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Category"
                  name="categories"
                  value={formData.categories}
                  onChange={handleInputChange}
                  style={{ width: "32%", marginTop: 15 }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 55,
                }}
              >
                <Button
                  variant="contained"
                  sx={{ width: 200 }}
                  onClick={(event) => {
                    if (
                      formData.title.length === 0 ||
                      formData.description.length === 0
                    ) {
                      setOpenAlert(true);
                      setAlertMessage("Please enter all the required fields");
                      setAlertStatus("error");
                    } else {
                      handleSubmit(event);
                    }
                  }}
                  style={{
                    textTransform: "none",
                    backgroundColor: "#9B5EA2",
                    height: 54,
                    margin: "0 auto",
                  }}
                >
                  Submit
                </Button>
              </div>
            </Box>
            <br />
          </div>
        </div>

        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          action={action}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={alertStatus}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

export default UploadQuestion;
