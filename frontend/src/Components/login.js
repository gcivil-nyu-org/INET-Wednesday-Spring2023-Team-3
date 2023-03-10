import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";


import { useState } from "react";
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


export default function SignInSide() {
 const handleSubmit = (event) => {
   event.preventDefault();
   const data = new FormData(event.currentTarget);
   console.log({
     email: data.get("email"),
     password: data.get("password"),
   });
 };
 const navigate = useNavigate();
 const signUp = () => {
   navigate("/SignUp");
 };
 const [name, setName] = React.useState("@nyu.edu");
 const [emailError, setEmailError] = useState("");
 return (
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
           Sign in
         </Typography>
         <Box
           component="form"
           onSubmit={handleSubmit}
           noValidate
           sx={{ mt: 1 }}
         >
           <TextField
             margin="normal"
             required
             fullWidth
             id="email"
             label="Email Address"
             name="email"
             autoComplete="email"
             autoFocus
             value={name}
             onChange={(event) => {
               const myArray = name.split("@");
               let re = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
               let word = myArray[1];
               if (word === "nyu.edu" && re.test(event.target.value)) {
                 setName(event.target.value);
               } else {
                 setEmailError("Enter valid NYU Email!");


               }
             }}
          
           />
           <br />
           <span
             style={{
               fontWeight: "bold",
               color: "red",
             }}
           >
             {emailError}
           </span>
           <TextField
             margin="normal"
             required
             fullWidth
             name="password"
             label="Password"
             type="password"
             id="password"
             autoComplete="current-password"
           />
            <FormControlLabel
             control={<Checkbox value="remember" color="primary" />}
             label="Remember me"
           />
           <Button
             type="submit"
             fullWidth
             variant="contained"
             sx={{ mt: 3, mb: 2 }}
           >
             Sign In
           </Button>
           <Grid container>
             <Grid item xs>
               <Link href="#" variant="body2">
                 Forgot password?
               </Link>
             </Grid>
             <Grid item>
               <Link component="button" onClick={signUp} variant="body2">
                 {"Don't have an account? Sign Up"}
               </Link>
             </Grid>
           </Grid>
         </Box>
       </Box>
       <Copyright sx={{ mt: 8, mb: 4 }} />
     </Container>
   </ThemeProvider>
 );
}
