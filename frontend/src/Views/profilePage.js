import { Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useContext, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import AuthContext from "../context/AuthContext";
import Navbar from "../Components/navbar";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const theme = createTheme();

  // Define state variables for the fetched data
  const [jobPreference, setJobPreference] = useState("Not entered yet");
  const [yearsOfExperience, setYearsOfExperience] = useState("Not entered yet");
  const [previousEmployer, setPreviousEmployer] = useState("Not entered yet");
  const [linkedinLink, setLinkedinLink] = useState("Not entered yet");
  const [githubLink, setGithubLink] = useState("Not entered yet");


  useEffect(() => {
    // Fetch data from API and update state variables
    fetch(`https://nyuinterviewappdevelop.com/profile-info/?email=${user.email}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setJobPreference(data.job_preference || "Not entered yet");
        setYearsOfExperience(data.years_of_experience || "Not entered yet");
        setPreviousEmployer(data.previous_employer || "Not entered yet");
        setLinkedinLink(data.linkedin_link || "Not entered yet");
        setGithubLink(data.github_link || "Not entered yet");
      })
      .catch((error) => console.error(error));
  }, [user.email]); // Add user.email as a dependency to useEffect


  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <div>
        <ThemeProvider theme={theme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Stack spacing={2} sx={{ width: "100%" }}>
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
                  {user.email} Profile Page
                </Typography>
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      {jobPreference}
                    </Grid>
                    <Divider />
                    <Grid item xs={12}>
                      {yearsOfExperience}
                    </Grid>
                    <Divider />
                    <Grid item xs={12}>
                      {previousEmployer}
                    </Grid>
                    <Divider />
                    <Grid item xs={12}>
                      {linkedinLink}
                    </Grid>
                    <Divider />
                    <Grid item xs={12}>
                      {githubLink}
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Stack>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}
export default ProfilePage;
