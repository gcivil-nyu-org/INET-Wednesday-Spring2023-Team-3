import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
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
import TextField from "@mui/material/TextField";
import Navbar from "./navbar";
import { API_ENDPOINT } from "./api";

function createData(type, title, difficulty, companies, positions, pk) {
  return { type, title, difficulty, companies, positions, pk };
}

function Homepage() {
  const navigate = useNavigate();

  const uploadQuestionPage = () => {
    navigate("/UploadQuestion");
  };

  const [questions, setQuestions] = useState([]);
  const [rows, setRows] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [positionsList, setPositionsList] = useState([]);
  const [difficultiesList, setDifficultiesList] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");
  const [submitSearch, setSubmitSearch] = useState("");

  const QUESTIONS_PER_PAGE = 15;

  // Update url
  useEffect(() => {
    let newUrl =
      `${API_ENDPOINT}/questions/get-questions/?single_page_count=` +
      QUESTIONS_PER_PAGE +
      "&cur_page=" +
      page;
    if (type.length !== 0) {
      newUrl += "&type=" + type;
    }
    if (company.length !== 0) {
      newUrl += "&company=" + company;
    }
    if (position.length !== 0) {
      newUrl += "&position=" + position;
    }
    if (difficulty.length !== 0) {
      newUrl += "&difficulty=" + difficulty;
    }
    if (submitSearch.length !== 0) {
      newUrl += "&title=" + submitSearch;
    }

    fetch(newUrl)
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.question_data);
        setTotalPage(Math.ceil(data.total_question_count / QUESTIONS_PER_PAGE));

        setCompaniesList(data.companies);
        setPositionsList(data.positions);
        setDifficultiesList(data.difficulties);
      })
      .catch((error) => console.error(error));
  }, [page, type, company, position, difficulty, submitSearch]);

  useEffect(() => {
    let newRows = [];
    questions.map((item) => {
      return newRows.push(
        createData(
          item.fields.type,
          item.fields.title,
          item.fields.difficulty,
          item.fields.companies,
          item.fields.positions,
          item.pk
        )
      );
    });
    setRows(newRows);
  }, [questions]);

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
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
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
          <div style={{ alignSelf: "flex-start", display: "flex", height: 60 }}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ minWidth: 80 }}>
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
                    <MenuItem value={"Coding"}>Coding</MenuItem>
                    <MenuItem value={"Behavioural"}>Behavioural</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 120 }}>
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
                    {companiesList.map((company) => (
                      <MenuItem id={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 100 }}>
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
                    {positionsList.map((position) => (
                      <MenuItem id={position} value={position}>
                        {position}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 100 }}>
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
                    {difficultiesList.map((difficulty) => (
                      <MenuItem value={difficulty}>{difficulty}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                style={{ width: "20vw" }}
              />
              <Button
                variant="outlined"
                sx={{ width: 100 }}
                style={{
                  textTransform: "none",
                  color: "#9B5EA2",
                  borderColor: "#9B5EA2",
                  height: 56,
                }}
                onClick={() => setSubmitSearch(search)}
              >
                Search
              </Button>
            </Stack>
          </div>
          <div style={{ alignSelf: "flex-end", height: 60 }}>
            <Button
              variant="contained"
              sx={{ width: 200 }}
              style={{
                textTransform: "none",
                backgroundColor: "#9B5EA2",
                height: 54,
              }}
              onClick={uploadQuestionPage}
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
                  <Typography variant="h6">Companies</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Positions</Typography>
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
                  <TableCell style={{ width: "60vw" }}>
                    <Link to={`/questions/${row.pk}`}>{row.title}</Link>
                  </TableCell>
                  <TableCell style={{ width: "10vw" }}>
                    {row.companies.length !== 0 &&
                      row.companies
                        .split(",")
                        .map((company) => (
                          <Chip id={company} label={company} />
                        ))}
                  </TableCell>
                  <TableCell style={{ width: "10vw" }}>
                    {row.positions.length !== 0 &&
                      row.positions
                        .split(",")
                        .map((position) => (
                          <Chip id={position} label={position} />
                        ))}
                  </TableCell>
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
                    ) : row.difficulty === "Expert" ? (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#276e72" }}
                      />
                    ) : row.difficulty === "Beginner" ? (
                      <Chip
                        label={row.difficulty}
                        style={{ color: "#FFFFFF", backgroundColor: "#276e72" }}
                      />
                    ) : (
                      <></>
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
            count={totalPage}
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
