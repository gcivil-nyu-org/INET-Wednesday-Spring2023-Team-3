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
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";

import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

function createData(title, author, createdAt, pk, email) {
  return { title, author, createdAt, pk, email };
}

function Experience() {
  const navigate = useNavigate();

  const uploadExperiencePage = () => {
    navigate("/uploadExperience");
  };

  const [experience, setExperience] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [search, setSearch] = useState("");
  const [submitSearch, setSubmitSearch] = useState("");

  const EXPERIENCE_PER_PAGE = 15;

  // Update url
  useEffect(() => {
    let newUrl =
      `${API_ENDPOINT}/experiences/list_experiences?single_page_count=` +
      EXPERIENCE_PER_PAGE +
      "&cur_page=" +
      page;
    if (submitSearch.length !== 0) {
      newUrl += "&title=" + submitSearch;
    }

    fetch(newUrl)
      .then((response) => response.json())
      .then((data) => {
        setExperience(data.experience_data);
        setTotalPage(
          Math.ceil(data.total_experience_count / EXPERIENCE_PER_PAGE)
        );
      })
      .catch((error) => console.error(error));
  }, [page, submitSearch]);

  useEffect(() => {
    let newRows = [];
    experience.map((item) => {
      return newRows.push(
        createData(
          item.fields.exp_title,
          item.fields.username,
          item.fields.created_at,
          item.pk,
          item.fields.email
        )
      );
    });
    setRows(newRows);
  }, [experience]);

  const handlePageChange = (event, value) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage(value);
  };
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ alignSelf: "flex-start", display: "flex", height: 60 }}>
            <Stack direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                value={search}
                onChange={handleSearchChange}
                style={{ width: "60vw" }}
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
                onClick={() => {
                  setSubmitSearch(search);
                  setPage(1);
                }}
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
              onClick={uploadExperiencePage}
            >
              Share your experience!
            </Button>
          </div>
        </div>
      </Box>

      <Divider
        variant="middle"
        style={{ color: "#9B5EA2", borderColor: "#9B5EA2" }}
      />
      <Box sx={{ padding: 2, textAlign: "center" }}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 , color: "#57068c" }}>
          Most Recent Experience
        </Typography>
      </Box>

      <Box sx={{ padding: 2 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Title</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Author</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Created Date</Typography>
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
                    style={{ width: "80vw" }}
                  >
                    <Typography variant="subtitle1">
                      <Link
                        to={`/experience/${row.pk}/${row.author}/${row.email}`}
                      >
                        {row.title}
                      </Link>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">{row.author}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {row.createdAt.slice(0, 10)}
                    </Typography>
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

export default Experience;
