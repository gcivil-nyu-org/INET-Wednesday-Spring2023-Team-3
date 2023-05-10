import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { API_ENDPOINT } from "../Components/api";
import logo from "../images/logo.jpg";
import { Menu, MenuItem } from "@mui/material";

function Navbar() {
  const navigate = useNavigate();
  const path = useLocation();
  const { user, logoutUser } = useContext(AuthContext);
  const [userType, setUserType] = useState("Hiring Manager");

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (user) {
      fetch(`${API_ENDPOINT}/get_user_type/${user.email}/`)
        .then((response) => response.json())
        .then((data) => {
          setUserType(data.user_type);
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  const homePage = () => {
    navigate("/");
  };
  const experiencePage = () => {
    navigate("/experience");
  };
  const quickStart = () => {
    navigate("/start");
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
    navigate("/editProfilePage");
  };
  const chatRoom = () => {
    navigate("/social");
  };
  const connect = () => {
    navigate("/connect");
  };
  const explore = () => {
    navigate("/recruiterHome");
  };

  return (
    <AppBar position="sticky" style={{ backgroundColor: "#57068c" }}>
      <Toolbar>
        <img
          src={logo}
          width="50px"
          height="50px"
          style={{ padding: "5px" }}
          alt="Logo"
        />
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={user && userType === "Hiring Manager" ? explore : homePage}
        >
          NYU Interview Prep
        </Typography>
        {user && userType === "Hiring Manager" ? (
          <Button color="inherit" onClick={explore}>
            Top users
          </Button>
        ) : null}
        <Button color="inherit" onClick={handleMenuClick}>
          Menu
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={homePage}>Questions</MenuItem>
          <MenuItem onClick={experiencePage}>Experience</MenuItem>
          {user && userType !== "Hiring Manager" && (
            <MenuItem onClick={quickStart}>Quick Start</MenuItem>
          )}
          <MenuItem onClick={connect}>Connect</MenuItem>
          <MenuItem onClick={chatRoom}>Social</MenuItem>
        </Menu>
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
