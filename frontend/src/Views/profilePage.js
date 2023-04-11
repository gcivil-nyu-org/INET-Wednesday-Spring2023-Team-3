import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Stack from "@mui/material/Stack";
import Divider from '@mui/material/Divider';

function ProfilePage() {
  console.log(user.email);
  const theme = createTheme();

  let jobPreference, yearsOfExperience, previousEmployer, linkedinLink, githubLink;
  fetch(`https://nyuinterviewappdevelop.com/nyu-profile/`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // Assign retrieved data to variables with default values if empty or undefined
      jobPreference = data.job_preference || "Not entered yet";
      yearsOfExperience = data.years_of_experience || "Not entered yet";
      previousEmployer = data.previous_employer || "Not entered yet";
      linkedinLink = data.linkedin_link || "Not entered yet";
      githubLink = data.github_link || "Not entered yet";

    })
    .catch(error => console.error(error));

  const { user, logoutUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const loginPage = () => {
    navigate("/login");
  };

  const homePage = () => {
   navigate("/");
 };
  const signUp = () => {
   navigate("/register");
 };
  const editProfilePage = () => {
   navigate("/editProfilePage")
 };

  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
    <AppBar position="sticky" style={{ backgroundColor: "#57068c" }}>
     {user ? (
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={homePage}
        >
          NYU Interview Prep
        </Typography>
        <Button color="inherit" onClick={editProfilePage}>
          Edit Profile
        </Button>
        <Button color="inherit" onClick={logoutUser}>
          Logout
        </Button>
      </Toolbar>
      ) : (
        <Toolbar>
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={homePage}
          >
            NYU Interview Prep
          </Typography>
          <Button color="inherit" onClick={loginPage}>
            Login
          </Button>
          <Button color="inherit" onClick={signUp}>
            Sign Up
          </Button>
        </Toolbar>
     )}
     </AppBar>
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
    )
}
export default ProfilePage;

