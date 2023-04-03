import { useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../Components/api";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
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

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_ENDPOINT}/password/reset/`, {
        email,
      });

      setIsSubmitted(true);
      setEmail("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
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
                  <Typography margin="normal" fullWidth>
                    Instructions for resetting your password have been sent to
                    your email.
                  </Typography>
                ) : (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      autoFocus
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Reset
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

function PasswordResetWrapper() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" />;
  }

  return <PasswordReset />;
}

export default PasswordResetWrapper;
