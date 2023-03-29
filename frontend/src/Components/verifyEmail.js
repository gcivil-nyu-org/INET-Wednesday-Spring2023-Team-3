import { useLocation } from "react-router-dom";
// import { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "./api";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
// import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";

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
   const theme = createTheme();


const VerifyEmail = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    console.log(code)

    const navigate = useNavigate();
    const Login = () => {
        navigate("/login");
    };
    

    const verifyEmail = async () => {
        try {
            const url = `${API_ENDPOINT}/signup/verify/?code=` + code;
            console.log(url);
            const response = await axios.get(url);
            console.log(response);
        } catch (error) {
            // alert(error.message);
        }
    };

    // Call the function to verify the email when the component loads
    React.useEffect(() => {
        verifyEmail();
    }, []);
    

    return ( 
        <>
            <div>
                <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">
                <CssBaseline />
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
                  Email Verify
                </Typography>
                <Box 
                component="form"
                noValidate
                sx={{ mt: 1 }}
                >
                    <>
                    <Typography 
                    margin="normal"
                    fullWidth 
                    >
                        Your email has been verified.
                    </Typography>
                    <Button 
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={Login}
                    >
                    Login
                    </Button>
                    </>
                
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
            </ThemeProvider>
            </div>
        </>
     );
}
 
export default VerifyEmail;