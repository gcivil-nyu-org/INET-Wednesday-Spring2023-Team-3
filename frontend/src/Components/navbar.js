import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
function Navbar() {
 const navigate = useNavigate();


 const homePage = () => {
   navigate("/");
 };
 const loginPage = () => {
   navigate("/login");
 };
 const signUp = () => {
   navigate("/register");
 };
 const profilePage = () => {
   navigate("/profile");
 };
 const editProfilePage = () => {
   navigate("/editProfilePage")
 };
 const { user, logoutUser } = useContext(AuthContext);
 return (
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
        <Button color="inherit" onClick={profilePage}>
          Profile
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
     )} : 
   </AppBar>
 );
}


export default Navbar;