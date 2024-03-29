import { Navigate, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState, useContext, useEffect } from "react";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import Card from '@mui/material/Card';
import AuthContext from "../context/AuthContext";
import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const isValidUrl = (urlString) => {
  if (!urlString) {
    // empty string or undefined
    return true;
  }

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
  const [file, setFile] = useState(null);
  const [fileCompanyProfile, setFileCompanyProfile] = useState(null);
  const [fileCompanyImage, setFileCompanyImage] = useState(null);

  const { user } = useContext(AuthContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [formData, setFormData] = useState({
    job_preference: "",
    years_of_experience: "",
    previous_employer: "",
    linkedin_link: "",
    github_link: "",
    img_file: "",
    user_summary: "",
    gpa: "",
    highest_degree: "",
    degree_subject: "",
  });

  const [companyFormData, setCompanyFormData] = useState({
    name: "",
    website: "",
    description: "",
    img_file: "",
    company_logo:"",
  });

  const [user_type, setUserType] = useState("Not entered yet");

  useEffect(() => {
    const fetchUserType = async (email) => {
      try {
        const response = await axios.get(`${API_ENDPOINT}/get_user_type/${email}/`);
        if (!response.data.user_type) {
          throw new Error('User type not found');
        }
        return response.data.user_type;
      } catch (error) {
        console.error('Error fetching user type:', error);
        throw error;
      }
    };
    fetchUserType(user.email)
      .then((userType) => {
        console.log(userType);
        setUserType(userType || "Not entered yet");
      })
      .catch(error => {
        // Handle error
      });
  }, [user.email]);

  useEffect(() => {
    // Fetch data from API and update state variables based on user type
    if (user_type === "Student/Alumni") { 
      fetch(`${API_ENDPOINT}/profile-info/${user.email}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setFormData((prevFormData) => ({
            ...prevFormData,
            job_preference: data.job_preference, // set the fetched value here
            years_of_experience: data.years_of_experience,
            previous_employer: data.previous_employer,
            linkedin_link: data.linkedin_link,
            github_link: data.github_link,
            img_file: data.img_file,
            user_summary: data.user_summary,
            gpa: data.gpa,
            highest_degree: data.highest_degree,
            degree_subject: data.degree_subject,
          }));
        })
        .catch((error) => console.error(error));
    } else if (user_type === "Hiring Manager") {
        fetch(`${API_ENDPOINT}/company-info/${user.email}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setCompanyFormData((prevFormData) => ({
              ...prevFormData,
              name: data.name,
              website: data.website,
              description: data.description,
              img_file: data.img_file,
              company_logo: data.company_logo,
            }));
          })
          .catch((error) => console.error(error));
      }
    }, [user.email, user_type]); // Add user.email and user.type as dependencies to useEffect



  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user_type === "Student/Alumni")  { // check if company form is active
      // handle company form submission

      if (
        formData.job_preference.length === 0 &&
        formData.years_of_experience.length === 0 &&
        formData.previous_employer.length === 0 &&
        formData.linkedin_link.length === 0 &&
        formData.github_link.length === 0 &&
        formData.img_file.length === 0 &&
        formData.user_summary.length === 0 &&
        formData.gpa.length === 0 &&
        formData.highest_degree.length === 0 &&
        formData.degree_subject.length === 0 

      ) {
        setAlertMessage("Please enter at least one field.");
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
      let newForm = new FormData();
      newForm.append("job_preference", formData.job_preference);
      newForm.append("years_of_experience", formData.years_of_experience);
      newForm.append("linkedin_link", formData.linkedin_link);
      newForm.append("github_link", formData.github_link);
      if (file) {
        newForm.append("img_file", file);
      }
      newForm.append("user_summary", formData.user_summary);
      newForm.append("gpa", formData.gpa);
      newForm.append("highest_degree", formData.highest_degree);
      newForm.append("degree_subject", formData.degree_subject);
      newForm.append("email", user.email);
      
      fetch(url, {
        method: "PUT",
        body: newForm,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          navigate("/profile", { replace: true });
        })
        .catch((error) => {
          console.error(error);
          return;
        });
          
    } else {
      //handle company profile submission
      if (
        companyFormData.name.length === 0 &&
        companyFormData.website.length === 0 &&
        companyFormData.description.length === 0 &&
        companyFormData.img_file.length === 0 &&
        companyFormData.company_logo === 0 
      ) {
        setAlertMessage("Please enter at least one field");
        setOpen(true);
        return;
      }
      if (!isValidUrl(companyFormData.company_website)) {
        setAlertMessage("Company website is not valid");
        setOpen(true);
        return;
      }   

      const url = `${API_ENDPOINT}/companies-profile/${user.email}/`;
      let newForm = new FormData();
      newForm.append("name", companyFormData.name);
      newForm.append("website", companyFormData.website);
      newForm.append("description", companyFormData.description);
      newForm.append("email", user.email);

      if (fileCompanyImage) {
        newForm.append("company_logo", fileCompanyImage);
      }
      
      if (fileCompanyProfile) {
        newForm.append("img_file", fileCompanyProfile);
      }

      fetch(url, {
        method: "PUT",
        body: newForm,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          navigate("/profile", { replace: true });
        })
        .catch((error) => {
          console.error(error);
          return;
        });
    }
  }

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleCompanyInputChange = (event) => {
    setCompanyFormData({
      ...companyFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleFileCompanyImageChange = (e) => {
    if (e.target.files) {
      setFileCompanyImage(e.target.files[0]);
    }
  };

  const handleFileCompanyProfileChange = (e) => {
    if (e.target.files) {
      setFileCompanyProfile(e.target.files[0]);
    }
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
          <Container component="main" style={{ width: "600px", height: "600px" }}>
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

              <div style={{ float: "left", marginLeft: -500}}>
                <Box
                sx={{
                  float: "left",
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
                >
                  
                {user_type === "Student/Alumni" ? (
                  <>
                  <Box
                  component="form"
                  noValidate
                  >
                    <Card sx={{ border: '2px solid purple', marginTop: -5, maxWidth: 400, marginLeft: 0 }}>
                      <Box sx={{
                      marginTop: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",}}>
                      <img src={formData.img_file} alt="Profile" style={{ border: '2px solid purple', width: "400px", height: "400px", objectFit: "cover" }} />
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
                            {user_type}
                          </Typography>

                          <Typography component="h1" variant="h5">
                            {user.email}
                          </Typography>
                          <div style={{ marginTop: 10 }}>
                          Upload Photo:
                            <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ marginLeft: 5, marginRight:-50 }}
                            />
                          </div>
                        </Box>
                      </Stack>
                    </Card>

                    <div style={{ marginTop: -40, maxWidth: 400, marginRight:-400, marginLeft:450 }}>
                    <Box
                      sx={{
                        marginTop: -66,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >  
                      
                      <Grid container spacing={3}>
                        
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
                    </Box>
                  </div>

                  <div style={{ marginTop: 10, maxWidth: 400, marginRight:-1000, marginLeft:900 }}>
                    <Box
                      sx={{
                        marginTop: -46.5,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    > 
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <FormControl fullWidth required>
                              <InputLabel id="demo-simple-select-label">
                                Highest Level of Education
                              </InputLabel>
                              <Select
                                labelId="highest_degree"
                                name="highest_degree"
                                id="highest_degree"
                                label="highest_degree"
                                value={formData.highest_degree}
                                onChange={handleInputChange}
                                autoWidth
                                autoFocus
                              >
                                <MenuItem value="Bachelors Degree">Bachelors Degree</MenuItem>
                                <MenuItem value="Masters Degree">Masters Degree</MenuItem>
                                <MenuItem value="PHD">Ph.D</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              //required
                              fullWidth
                              name="degree_subject"
                              label="Degree Focus"
                              id="degree_subject"
                              value={formData.degree_subject}
                              onChange={handleInputChange}
                              autoComplete="Degree Subject"
                            />{" "}
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              //required
                              fullWidth
                              name="gpa"
                              label="Degree GPA"
                              id="github_link"
                              value={formData.gpa}
                              onChange={handleInputChange}
                              autoComplete="GPA"
                            />{" "}
                          </Grid>
                          <Grid item xs={12}>
                              <TextField
                                //required
                                fullWidth
                                multiline
                                rows={5}
                                id="user_summary"
                                label="User Summary"
                                name="user_summary"
                                autoComplete="user_summary"
                                value={formData.user_summary}
                                onChange={handleInputChange}
                              />
                            </Grid>
                        </Grid>
                      </Box>
                   </div>

                   <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2, marginLeft:80, marginRight:-160, width: '100%' }}
                      onClick={(event) => {
                        handleSubmit(event);
                      }
                    }
                        >
                        Update
                        </Button>
                      </Box>

                  </>
                ) : (
                  <>
                  <Box
                  component="form"
                  noValidate
                  >
                  <div style={{ marginTop: -20, maxWidth: 700, marginRight:-350, marginLeft:0}}>

                    <Card sx={{ border: '2px solid purple', maxWidth: 400, marginLeft: 0 }}>
                        <Box sx={{
                        marginTop: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",}}>
                        <img src={companyFormData.company_logo} alt="Profile" style={{border: '2px solid purple', width: "400px", height: "400px", objectFit: "cover" }} />
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
                              {companyFormData.name}
                            </Typography>

                            <div style={{ marginTop: 10 }}>
                            Upload Photo3:
                              <input
                              type="file"
                              onChange={handleFileCompanyImageChange}
                              accept="image/*"
                              style={{ marginLeft: 5, marginRight:-45 }}
                              />
                            </div>
                          </Box>
                        </Stack>
                      </Card>  
                    </div>

                  
                    <div style={{ marginTop: 10, marginRight:-600, marginLeft:450, maxWidth: 400, }}>
                        <Box
                        sx={{
                          marginTop: -64,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      > 

                      
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                              <TextField
                                //required
                                fullWidth
                                name="name"
                                label="Company Name"
                                id="name"
                                value={companyFormData.name}
                                onChange={handleCompanyInputChange}
                                autoComplete="Company Name"
                              />{" "}
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                //required
                                fullWidth
                                name="website"
                                label="Company Website"
                                id="website"
                                value={companyFormData.website}
                                onChange={handleCompanyInputChange}
                                autoComplete="Company Website"
                              />{" "}
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                //required
                                fullWidth
                                multiline
                                rows={6}
                                id="description"
                                label="Company Description"
                                name="description"
                                autoComplete="description"
                                value={companyFormData.description}
                                onChange={handleCompanyInputChange}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      
                      </div>


                      <div style={{ marginTop: 10, }}>

                        <Card sx={{ border: '2px solid purple', marginTop: -40, marginRight:-250, marginLeft: 115, maxWidth:400,}}>
                          <Box sx={{
                          marginTop: 0,
                          display: "flex", 
                          flexDirection: "column",
                          alignItems: "center",}}>
                          <img src={companyFormData.img_file} alt="Profile" style={{ border: '2px solid purple', width: "400px", height: "400px", objectFit: "cover" }} />
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
                                  {user_type}
                                </Typography>

                                <Typography component="h1" variant="h5">
                                  {user.email}
                                </Typography>

                                <div style={{ marginTop: 10, marginLeft: 40, marginRight:-30,}}>
                                  Update Photo2:
                                  <input
                                  type="file"
                                  onChange={handleFileCompanyProfileChange}
                                  accept="image/*"
                                  style={{ marginLeft: 5 }}
                                  />
                                </div>
                              </Box>
                          </Stack>
                        </Card>       
                      </div>

                      <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2, marginLeft:65, marginRight:-150, width: '100%' }}
                      onClick={(event) => {
                          handleSubmit(event);
                        }
                      }
                          >
                          Update
                          </Button>
                        </Box>

                      </>
                    )}

               
                </Box>
                </div>
              
            </Stack>
          </Container>
        </ThemeProvider>
      </div>
    </>
  );
}
export default EditProfile;
