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

function createData(type, title, difficulty) {
  return { type, title, difficulty };
}
const rows = [
  createData("Coding", "Two Sum", "Easy"),
  createData(
    "behavioral",
    "Describe a time you have a conflict with team member",
    "Easy"
  ),
  createData("Coding", "Two Sum", "Easy"),
  createData("Coding", "Two Sum", "Easy"),
  createData(
    "behavioral",
    "Describe a time you have a conflict with team member",
    "Easy"
  ),
  createData("Coding", "Two Sum", "Easy"),
  createData("Coding", "Two Sum", "Medium"),
  createData("Coding", "Two Sum", "Hard"),
  createData("Coding", "Two Sum", "Easy"),
  createData(
    "behavioral",
    "Describe a time you have a conflict with team member",
    "Medium"
  ),
  createData("Coding", "Two Sum", "Hard"),
];

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

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://nyuprepapi.com/api/")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);
  console.log(data);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ backgroundColor: "#57068c" }}>
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              NYU Interview Prep
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>

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
              {rows.map((row) => (
                <TableRow
                  key={row.title}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.type === "Coding" ? (
                      <Chip
                        label={row.type}
                        variant="outlined"
                        style={{ color: "#F29494", borderColor: "#F29494" }}
                      />
                    ) : (
                      <Chip
                        label={row.type}
                        variant="outlined"
                        style={{ color: "#94C0F2", borderColor: "#94C0F2" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {row.difficulty === "Easy" ? (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#78A5F5" }}
                      />
                    ) : row.difficulty === "Medium" ? (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#C778F5" }}
                      />
                    ) : (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#F57891" }}
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

export default App;
