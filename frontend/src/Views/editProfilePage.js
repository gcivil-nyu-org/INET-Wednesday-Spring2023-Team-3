import { Navigate, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useContext } from "react";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";

import AuthContext from "../context/AuthContext";
import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

function EditProfile() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState("error");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    job_preference: "",
    years_of_experience: "",
    previous_employer: "",
    linkedin_link: "",
    github_link: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      formData.job_preference.length === 0 ||
      formData.years_of_experience.length === 0 ||
      formData.previous_employer.length === 0 ||
      formData.linkedin_link.length === 0 ||
      formData.github_link.length === 0
    ) {
      setAlertMessage("Please enter all the fields");
      setOpen(true);
      return;
    }
    if (isNaN(formData.years_of_experience)) {
      setAlertMessage("Years of working experience has to be a number");
      setOpen(true);
      return;
    }
    if (!isValidUrl(formData.linkedin_link)) {
      setAlertMessage("Linkedin link is not valid");
      setOpen(true);
      return;
    }
    if (!isValidUrl(formData.github_link)) {
      setAlertMessage("Github link is not valid");
      setOpen(true);
      return;
    }

    const url = `${API_ENDPOINT}/nyu-profile/${user.email}/`;

    const postReq = JSON.stringify({
      ...formData,
      email: user.email,
    });
    console.log(postReq);

    try {
      const response = await axios.put(url, postReq, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      navigate("/profile", { replace: true });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const theme = createTheme();
  return (
    <>
      <Navbar />
      <div>
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {alertMessage}
                </Alert>
              </Snackbar>
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Update Profile Page
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete="Email"
                        name="Email"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        value={user.email}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete="Job"
                        name="job_preference"
                        //required
                        fullWidth
                        id="job_preference"
                        label="Job Preference"
                        value={formData.job_preference}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        // required
                        fullWidth
                        id="years_of_experience"
                        label="Years of Working Experience"
                        name="years_of_experience"
                        value={formData.years_of_experience}
                        onChange={handleInputChange}
                        autoComplete="experience"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        //required
                        fullWidth
                        id="previous_employer"
                        label="Previous Employer"
                        name="previous_employer"
                        autoComplete="previous_employer"
                        value={formData.previous_employer}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        //required
                        fullWidth
                        name="linkedin_link"
                        label="LinkedIn Profile Link"
                        id="linkedin_link"
                        value={formData.linkedin_link}
                        onChange={handleInputChange}
                        autoComplete="Linkedin"
                      />{" "}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        //required
                        fullWidth
                        name="github_link"
                        label="Github Profile Link"
                        id="github_link"
                        value={formData.github_link}
                        onChange={handleInputChange}
                        autoComplete="Github"
                      />{" "}
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            </Stack>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}
export default EditProfile;
