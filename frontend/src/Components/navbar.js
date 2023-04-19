import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
function Navbar() {
  const navigate = useNavigate();
  const path = useLocation();

  const homePage = () => {
    navigate("/");
  };

  const quickStart = () => {
    navigate("/start");
  }
  
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
    navigate("/editProfilePage");
  };

  const { user, logoutUser } = useContext(AuthContext);
  return (
    <AppBar position="sticky" style={{ backgroundColor: "#57068c" }}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={homePage}
        >
          NYU Interview Prep
        </Typography>
        {user ? 
        <Button color="inherit" onClick={quickStart}>
          Quick Start
        </Button>
        : null}
        {user && path.pathname === "/profile" ? (
          <Button color="inherit" onClick={editProfilePage}>
            Edit Profile
          </Button>
        ) : (
          user && (
            <Button color="inherit" onClick={profilePage}>
              Profile
            </Button>
          )
        )}
        {user && (
          <Button color="inherit" onClick={logoutUser}>
            Logout
          </Button>
        )}
        {!user && (
          <>
            <Button color="inherit" onClick={loginPage}>
              Login
            </Button>
            <Button color="inherit" onClick={signUp}>
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
