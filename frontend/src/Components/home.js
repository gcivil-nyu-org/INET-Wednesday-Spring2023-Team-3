import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";

import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";

import Navbar from "./navbar";

function createData(type, title, difficulty) {
  return { type, title, difficulty };
}

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
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [rows, setRows] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    fetch(
      "https://nyuprepapi.com/api/questions/cur_page/" +
        page +
        "/single_page_count/15"
    )
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, [page]);

  useEffect(() => {
    let newRows = [];
    data.map((item) => {
      return newRows.push(
        createData(item.fields.type, item.fields.title, item.fields.difficulty)
      );
    });
    setRows(newRows);
  }, [data]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  };
  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };
  const handlePageChange = (event, value) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage(value);
  };

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ alignSelf: "flex-start" }}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ minWidth: 150 }}>
                <FormControl fullWidth>
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    labelId="type-select-label"
                    id="type-simple-select"
                    value={type}
                    label="Type"
                    onChange={handleTypeChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={10}>Coding</MenuItem>
                    <MenuItem value={20}>Behavioural</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <FormControl fullWidth>
                  <InputLabel id="company-select-label">Company</InputLabel>
                  <Select
                    labelId="company-select-label"
                    id="company-simple-select"
                    value={company}
                    label="Company"
                    onChange={handleCompanyChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={10}>Meta</MenuItem>
                    <MenuItem value={20}>Google</MenuItem>
                    <MenuItem value={30}>Apple</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <FormControl fullWidth>
                  <InputLabel id="position-select-label">Position</InputLabel>
                  <Select
                    labelId="position-select-label"
                    id="position-simple-select"
                    value={position}
                    label="Position"
                    onChange={handlePositionChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={10}>Software Engineer</MenuItem>
                    <MenuItem value={20}>Data Engineer</MenuItem>
                    <MenuItem value={30}>Product Manager</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 150 }}>
                <FormControl fullWidth>
                  <InputLabel id="difficulty-select-label">
                    Difficulty
                  </InputLabel>
                  <Select
                    labelId="difficulty-select-label"
                    id="difficulty-simple-select"
                    value={difficulty}
                    label="Difficulty"
                    onChange={handleDifficultyChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value={10}>Easy</MenuItem>
                    <MenuItem value={20}>Medium</MenuItem>
                    <MenuItem value={30}>Hard</MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
          </div>
          <div style={{ alignSelf: "flex-end" }}>
            <Button
              variant="outlined"
              sx={{ width: 250 }}
              style={{
                textTransform: "none",
                color: "#9B5EA2",
                borderColor: "#9B5EA2",
                margin: 20,
              }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              sx={{ width: 300 }}
              style={{ textTransform: "none", backgroundColor: "#9B5EA2" }}
            >
              Upload a question!
            </Button>
          </div>
        </div>
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
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ width: "5vw" }}
                  >
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
                  <TableCell style={{ width: "80vw" }}>{row.title}</TableCell>
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

        <div
          style={{
            marginTop: 15,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pagination
            count={12}
            page={page}
            variant="outlined"
            color="secondary"
            onChange={handlePageChange}
            style={{ margin: "0 auto" }}
          />
        </div>
      </Box>
    </>
  );
}

export default Homepage;
