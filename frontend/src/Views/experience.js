import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

function createData(title, author, createdAt, pk) {
  return { title, author, createdAt, pk };
}

function Experience() {
  const navigate = useNavigate();

  const uploadQuestionPage = () => {
    navigate("/UploadQuestion");
  };

  const [experiences, setExperiences] = useState([]);
  const [rows, setRows] = useState([]);

  // Update url
  useEffect(() => {
    let newUrl = `${API_ENDPOINT}/experiences/list_experiences`;
    fetch(newUrl)
      .then((response) => response.json())
      .then((data) => {
        setExperiences(data.experience_data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    let newRows = [];
    experiences.map((item) => {
      return newRows.push(
        createData(
          item.fields.exp_title,
          item.fields.user,
          item.fields.created_at,
          item.pk
        )
      );
    });
    setRows(newRows);
  }, [experiences]);

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
                value={""}
                onChange={() => {}}
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
                onClick={() => {}}
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
              Share your experience!
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
                    <Typography variant="subtitle1">{row.title}</Typography>
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
      </Box>
    </>
  );
}

export default Experience;
