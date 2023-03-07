import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const loginPage = () => {
    navigate("/SignInSide");
  };
  const signUp = () => {
    navigate("/SignUp");
  };

  return (
    <AppBar position="sticky" style={{ backgroundColor: "#57068c" }}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          NYU Interview Prep
        </Typography>
        <Button color="inherit" onClick={loginPage}>
          Login
        </Button>
        <Button color="inherit" onClick={signUp}>
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
