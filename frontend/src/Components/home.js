import * as React from "react";
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function createData(type, title, difficulty) {
  return { type, title, difficulty };
}
let rows = [];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "80ch",
      "&:focus": {
        width: "80ch",
      },
    },
  },
}));

function Homepage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const loginPage = () => {
    navigate("/SignInSide");
  };
  const signUp = () =>{
    navigate("/SignUp")
  }
  useEffect(() => {
    fetch("https://nyuprepapi.com/api/questions")
      .then((response) => response.json())
      .then((data) => setData(data))
      .then(
        data.map((item) => {
          return rows.push(
            createData(
              item.fields.type,
              item.fields.title,
              item.fields.difficulty
            )
          );
        })
      )
      .catch((error) => console.error(error));
  }, [data]);

  return (
    <>
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

      <Box sx={{ padding: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            sx={{ width: 300 }}
            style={{
              textTransform: "none",
              backgroundColor: "#9B5EA2",
              float: "right",
              position: "relative",
            }}
          >
            Up load a question!
          </Button>
          <Button
            variant="outlined"
            sx={{ width: 100 }}
            style={{ color: "#9B5EA2", borderColor: "#9B5EA2" }}
          >
            Major
          </Button>
          <Button
            variant="outlined"
            sx={{ width: 100 }}
            style={{ color: "#9B5EA2", borderColor: "#9B5EA2" }}
          >
            Job
          </Button>
          <Button
            variant="outlined"
            sx={{ width: 150 }}
            style={{ color: "#9B5EA2", borderColor: "#9B5EA2" }}
          >
            Difficulty
          </Button>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Stack>
      </Box>

      <Divider
        variant="middle"
        style={{ color: "#9B5EA2", borderColor: "#9B5EA2" }}
      />

      <Box sx={{ padding: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Type</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Title</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Difficulty</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, 70).map((row,index) => (
                <TableRow
                  key= {index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.type === "Behavioural" ? (
                      <Chip
                        label={row.type}
                        variant="outlined"
                        style={{ color: "#454AE5", borderColor: "#454AE5" }}
                      />
                    ) : (
                      <Chip
                        label="Coding"
                        variant="outlined"
                        style={{ color: "#C01C63", borderColor: "#C01C63" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {row.difficulty === "Easy" ? (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#50ecb3" }}
                      />
                    ) : row.difficulty === "Medium" ? (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#94d3c5" }}
                      />
                    ) : row.difficulty === "Hard" ? (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#41a9b6" }}
                      />
                    ) : (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#276e72" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

export default Homepage;
