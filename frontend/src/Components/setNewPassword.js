import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "./api";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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

const SetNewPassword = () => {
        
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (newPassword === newPasswordConfirm) {
                
                // console.log(code);
                // console.log(newPassword);
                            
                const response = await axios.post(
                    `${API_ENDPOINT}/password/reset/verified/`,
                    {
                    "code": code,
                    "password": newPassword
                    },
                    {
                    headers: {
                        "Content-Type": "application/json"
                    }
                    }
                );
                // console.log(response);
                setIsSubmitted(true);
                setNewPassword("");
                setNewPasswordConfirm("");
                setError(null);
            } else {
                setNewPassword("");
                setNewPasswordConfirm("");
                setError("Passwords must match, please re-enter.");

            }
        } catch (error) {
            setError(error.message);
        }
    };

    const navigate = useNavigate();
    const Login = () => {
        navigate("/login");
    };
    
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
              Password Reset
            </Typography>
            <Box 
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
            >
            {error && <p>{error}</p>}
            {isSubmitted ? (
                <>
                <Typography 
                margin="normal"
                fullWidth 
                >
                    Password reset successful.
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
            ) : (
                <>
                <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="New Password"
                name="newPassword"
                autoFocus
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                id="newPasswordConfirm"
                label="Confirm new password"
                name="newPasswordConfirm"
                autoFocus
                type="password"
                value={newPasswordConfirm}
                onChange={(event) => setNewPasswordConfirm(event.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Confirm
                </Button>
                </>
            )}
            </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
        </ThemeProvider>
        </div>
    </>
    );
}
 
export default SetNewPassword;