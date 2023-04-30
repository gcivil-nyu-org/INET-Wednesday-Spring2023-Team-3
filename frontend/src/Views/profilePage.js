import { Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useContext, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import AuthContext from "../context/AuthContext";
import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  const theme = createTheme();

  // Function to fetch user type based on email using Fetch API
  const fetchUserType = async (email) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/get_user_type/${email}/`); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error('Error fetching user type');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user type:', error);
      throw error;
    }
  };
  const [user_type, setUserType] = useState("Not entered yet");
  // Usage example
  //const email = 'example@example.com'; // Replace with the actual email
  fetchUserType(user.email)
    //.then((response) => response.json()) Don't think I need this. 
    .then(data => {
      console.log(data);
      setUserType(data.user_type || "Not entered yet"); // Access the user_type field from the response data
    })
    .catch(error => {
      // Handle error
    });

  // Define state variables for the fetched data
  const [jobPreference, setJobPreference] = useState("Not entered yet");
  const [yearsOfExperience, setYearsOfExperience] = useState("Not entered yet");
  const [previousEmployer, setPreviousEmployer] = useState("Not entered yet");
  const [linkedinLink, setLinkedinLink] = useState("Not entered yet");
  const [githubLink, setGithubLink] = useState("Not entered yet");
  const [company, setCompany] = useState("Not entered yet"); //Added
  const [website, setWebsite] = useState("Not entered yet"); //Added
  const [description, setDescription] = useState("Not entered yet"); //Added
  const [imgFile, setImgFile] = useState("");

  useEffect(() => {
    // Fetch data from API and update state variables based on user type
    if (user_type === "Student/Alumni") { 
      fetch(`${API_ENDPOINT}/profile-info/${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setJobPreference(data.job_preference || "Not entered yet");
          setYearsOfExperience(data.years_of_experience || "Not entered yet");
          setPreviousEmployer(data.previous_employer || "Not entered yet");
          setLinkedinLink(data.linkedin_link || "Not entered yet");
          setGithubLink(data.github_link || "Not entered yet");
          setImgFile(data.imgFile || "Not entered yet")
        })
        .catch((error) => console.error(error));
    } else if (user_type === "Hiring Manager") {
        fetch(`${API_ENDPOINT}/company-info/${user.email}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCompany(data.name || "Not entered yet");
            setWebsite(data.website || "Not entered yet");
            setDescription(data.description || "Not entered yet");
            setImgFile(data.imgFile || "Not entered yet")
          })
          .catch((error) => console.error(error));
      }
    }, [user.email, user_type]); // Add user.email and user.type as dependencies to useEffect

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
            <Box sx={{
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",}}>
                  <img src={imgFile} alt="Profile" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
                </Box>
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Box
                sx={{
                  marginTop: 5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Profile Page
                </Typography>
                <div style={{ marginTop: 20, marginBottom: 20 }}>
                  <Divider variant="middle" width="600px" />
                </div>

                {user_type === "Student/Alumni" ? (
                <>
                  <Typography
                    component="h3"
                    variant="h7"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    Job Preference: {jobPreference}
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h7"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    Years of Experience: {yearsOfExperience}
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h7"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    Previous Employer: {previousEmployer}
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h7"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    <a href={linkedinLink}>Linkedin</a> |{" "}
                    <a href={githubLink}>Github</a>
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    component="h3"
                    variant="h7"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    Company: {company}
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h7"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    Website: {website}
                  </Typography>
                  <Typography
                    component="h3"
                    variant="h7"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    Description: {description}
                  </Typography>
                </>
              )} 
              </Box>
            </Stack>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}
export default ProfilePage;
