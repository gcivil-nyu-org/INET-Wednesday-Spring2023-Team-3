import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        NYU Interview Prep
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Register() {
  const [open, setOpen] = React.useState(false);


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const { registerUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    userType: "",
    first_name: "",
    last_name: "",
    email: "",
    password1: "",
  });

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "userType") {
      setFormData({ ...formData, userType: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(
      formData.userType,
      formData.email,
      formData.first_name,
      formData.last_name,
      formData.password1
    );
    setOpen(true);
    console.log(formData);
    
  };
  const navigate = useNavigate();
  const loginPage = () => {
    navigate("/login");
  };
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
               Registration Successful! Please verify Email Address!
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
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">
                      Type of User
                    </InputLabel>
                    <Select
                      labelId="userType"
                      name="userType"
                      id="userType"
                      label="Type of User"
                      value={formData.userType}
                      onChange={handleInputChange}
                      autoWidth
                      autoFocus
                    >
                      <MenuItem value="Student/Alumni">Student/Alumni</MenuItem>
                      <MenuItem value="Hiring Manager">Hiring Manager</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="first_name"
                    required
                    fullWidth
                    id="first_name"
                    label="First Name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="last_name"
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password1"
                    label="Password"
                    type="password"
                    id="password1"
                    value={formData.password1}
                    onChange={handleInputChange}
                    autoComplete="new-password"
                  />{" "}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component="button" onClick={loginPage} variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Stack>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Register;
