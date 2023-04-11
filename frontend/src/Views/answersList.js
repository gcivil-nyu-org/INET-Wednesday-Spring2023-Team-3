import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";

function createData(answerID, title, createdDate) {
  return { answerID, title, createdDate };
}

function AnswersList() {
  const { question_id } = useParams();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const url = `${API_ENDPOINT}/list_answers_for_ques/${question_id}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        let rowsData = [];
        data.answer_data.map((answer) => {
          return rowsData.push(
            createData(answer.pk, answer.fields.title, answer.fields.created_at)
          );
        });
        setRows(rowsData);
      })
      .catch((error) => console.error(error));
  }, [question_id]);

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            padding: 30,
          }}
        >
          {rows.length === 0 ? (
            <img
              src="https://media.makeameme.org/created/what-if-i-b1iy3m.jpg"
              alt="no solution"
            />
          ) : (
            <TableContainer
              component={Paper}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow style={{ backgroundColor: "#EEEEEE" }}>
                    <TableCell>Title</TableCell>
                    <TableCell>Created Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        <Link to={`/answer/${row.answerID}`}>{row.title}</Link>
                      </TableCell>
                      <TableCell>{row.createdDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </>
  );
}

export default AnswersList;
