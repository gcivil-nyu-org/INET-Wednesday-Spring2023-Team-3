import React, { useState, useContext } from "react";
import { Navigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";
import AuthContext from "../context/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UploadExperience() {
  const { user } = useContext(AuthContext);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("success");
  const [alertMessage, setAlertMessage] = useState("Upload successful");
  const [file, setFile] = useState(null);

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
    body: "",
  });

  const handleInputChange = (event) => {
    console.log(formData);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let newForm = new FormData();
    newForm.append("exp_title", formData.title);
    newForm.append("exp_text", formData.body);
    newForm.append("user", user.user_id);
    if (file) {
      newForm.append("img_file", file);
    }
    fetch(`${API_ENDPOINT}/experiences/post_experience/`, {
      method: "POST",
      body: newForm,
    })
      .then((response) => response.json())
      .then((data) => {
        setOpenAlert(true);
        setAlertMessage("Experience has been uploaded successfully");
        setAlertStatus("success");
        console.log(data);
        setFormData({
          title: "",
          body: "",
        });
        setFile(null);
      })
      .catch((error) => {
        setOpenAlert(true);
        setAlertMessage(error);
        setAlertStatus("error");
        console.error(error);
        return;
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
              <Typography variant="h6">Share your experience:</Typography>
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
                  label="Body"
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  multiline
                  style={{ width: "100%", marginTop: 15 }}
                  maxRows={18}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                Attach an image to your experience:
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ marginLeft: 5 }}
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
                      formData.body.length === 0
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

export default UploadExperience;
