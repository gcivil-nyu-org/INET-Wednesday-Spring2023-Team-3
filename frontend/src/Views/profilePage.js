import { Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useContext, useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Card from '@mui/material/Card';
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
  const [user_type, setUserType] = useState("Not entered yet")
  
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
  const [studentImgFile, setStudentImgFile] = useState("Not entered yet");
  const [userSummary, setUserSummary] = useState("Not entered yet"); 
  const [gpa, setGPA] = useState("Not entered yet");
  const [highestDegree, setHighestDegree] = useState("Not entered yet");

  const [company, setCompany] = useState("Not entered yet"); 
  const [website, setWebsite] = useState("Not entered yet"); 
  const [description, setDescription] = useState("Not entered yet");
  const [recruiterImgFile, setRecruiterImgFile] = useState("Not entered yet");
  const [companyLogo, setCompanyLogo] = useState("Not entered yet");

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
          setStudentImgFile(data.img_file || "Add a Profile Photo");
          setUserSummary(data.user_summary || "Not entered yet");
          setGPA(data.gpa || "Not entered yet");
          setHighestDegree(data.highest_degree || "Add a Profile Photo");
        })
        .catch((error) => console.error(error));
    } else if (user_type === "Hiring Manager") {
        fetch(`${API_ENDPOINT}/company-info/${user.email}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCompany(data.name || "Company Name");
            setWebsite(data.website || "Company Website");
            setDescription(data.description || "Company Description");
            setRecruiterImgFile(data.img_file || "Add a Profile Photo");
            setCompanyLogo(data.img_file || "Add a Profile Photo");
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
            {user_type === "Student/Alumni" ? (
              <>
              <Card sx={{ marginTop: 5, maxWidth: 345, marginLeft: -45 }}>
                <Box sx={{
                      marginTop: 5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",}}>
                      <img src={studentImgFile} alt="Profile" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
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

                    <Typography component="h1" variant="h5">
                      {studentImgFile}, {user.email}
                    </Typography>
                    <div style={{ marginTop: 20, marginBottom: 20 }}>
                      <Divider variant="middle" width="600px" />
                    </div>

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
                    </Box>
                  </Stack>
                </Card>

                <Card sx={{ marginTop: -65, maxWidth: 600, }}>
                  
                <Box
                    sx={{
                      marginTop: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="h1" variant="h7">
                        About
                      </Typography>
                      <div style={{ marginTop: 0, marginBottom: 0 }}>
                        <Divider variant="middle" />
                      </div>

                        <Typography
                          component="h3"
                          variant="h7"
                          style={{ marginTop: 10, marginBottom: 10 }}
                        > {jobPreference}
                        </Typography>
                    </Box>
                </Card>

                <Card sx={{ marginTop: 4, maxWidth: 800, }}>
                  
                <Box
                    sx={{
                      marginTop: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="h1" variant="h7">
                        User Stats
                      </Typography>
                      <div style={{ marginTop: 0, marginBottom: 0 }}>
                        <Divider variant="middle" />
                      </div>

                        <Typography
                          component="h3"
                          variant="h7"
                          style={{ marginTop: 5, marginBottom: 5, }}
                        > Questions Posted | stats {userSummary}
                        </Typography>
                        <Typography
                          component="h3"
                          variant="h7"
                          style={{ marginTop: 5, marginBottom: 5, }}
                        > Questions Answered | stats {gpa}
                        </Typography>
                        <Typography
                          component="h3"
                          variant="h7"
                          style={{ marginTop: 5, marginBottom: 5, }}
                        > Experiences Posted | stats {highestDegree}
                        </Typography>
                    </Box>
                </Card>
                <Card sx={{ marginTop: -33, marginLeft: 52, marginRight: -50, maxWidth: 800, }}>
                  
                <Box
                    sx={{
                      marginTop: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="h1" variant="h7">
                        Conversations
                      </Typography>
                      <div style={{ marginTop: 0, marginBottom: 0 }}>
                        <Divider variant="middle" />
                      </div>

                        <Typography
                          component="h3"
                          variant="h7"
                          style={{ marginTop: 5, marginBottom: 5, }}
                        > User 1
                        </Typography>
                        <Typography
                          component="h3"
                          variant="h7"
                          style={{ marginTop: 5, marginBottom: 5, }}
                        > User 2
                        </Typography>
                        <Typography
                          component="h3"
                          variant="h7"
                          style={{ marginTop: 5, marginBottom: 5, }}
                        > User 3
                        </Typography>
                    </Box>
                </Card>
              </>
                  ) : (
                    <>
                      <Card sx={{ marginTop: 5, maxWidth: 345, marginLeft: -45 }}>
                        <Box sx={{
                              marginTop: 5,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",}}>
                              <img src={companyLogo} alt="Profile" style={{ width: "200px", height: "200px", objectFit: "cover" }} />
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
                            <Typography
                              component="h3"
                              variant="h7"
                              style={{ marginTop: 5, marginBottom: 10 }}
                            >
                              {company}
                            </Typography>
                            <Typography
                              component="h3"
                              variant="h7"
                              style={{ marginTop: 5, marginBottom: 10 }}
                            >
                              <a href={website}>Company Website</a> 
                            </Typography>
                          </Box>
                        </Stack>

                      </Card>
                      <Card sx={{ marginTop: 5, maxWidth: 345, marginLeft: -45 }}>
                        <Box sx={{
                              marginTop: 5,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",}}>
                              <img src={recruiterImgFile} alt="Profile" style={{ width: "75px", height: "75px", objectFit: "cover" }} />
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
                            <div style={{ marginTop: 20, marginBottom: 20 }}>
                              <Divider variant="middle" width="600px" />
                            </div>

                            <Typography component="h1" variant="h5">
                            {user.email}
                            </Typography>
                            
                            <Typography
                              component="h3"
                              variant="h7"
                              style={{ marginTop: 10, marginBottom: 10 }}
                            >
                              {user_type}
                            </Typography>
                          </Box>
                        </Stack>
                      </Card>

                      <Card sx={{ marginTop: -70, maxWidth: 800, marginLeft: 5  }}>
                      <Box
                            sx={{
                              marginTop: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                        <Typography component="h1" variant="h5">
                              Summary
                            </Typography>
                            <div style={{ marginTop: 10, marginBottom: 20 }}>
                              <Divider variant="middle" />
                            </div>

                              <Typography
                                component="h3"
                                variant="h7"
                                style={{ marginTop: 10, marginBottom: 10 }}
                              > {description}
                              </Typography>
                        </Box>
                      </Card>
                      <Card sx={{ marginTop: 15, maxWidth: 800, marginLeft: 5  }}>
                      <Box
                            sx={{
                              marginTop: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >

                            <Typography component="h1" variant="h5">
                                  Conversations
                                </Typography>
                                <div style={{ marginTop: 10, marginBottom: 10 }}>
                                  <Divider variant="middle"  />
                                </div>

                                  <Typography
                                    component="h3"
                                    variant="h7"
                                    style={{ marginTop: 10, marginBottom: 10 }}
                                  > {description}
                                  </Typography>
                        </Box>
                      </Card>
                  </>
                )} 
                
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}
export default ProfilePage;
