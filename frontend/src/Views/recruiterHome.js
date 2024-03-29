import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import Navbar from "../Components/navbar";
import AuthContext from "../context/AuthContext";
import { API_ENDPOINT } from "../Components/api";
import { Stack } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

function createData(
  username,
  avg_rec_rating_received,
  num_exp_posted,
  num_rec_posted,
  num_codes_posted,
  num_totalcmnts_posted,
  num_expcmnts_posted,
  num_anscmnts_posted,
  email
) {
  return {
    username,
    avg_rec_rating_received,
    num_exp_posted,
    num_rec_posted,
    num_codes_posted,
    num_totalcmnts_posted,
    num_expcmnts_posted,
    num_anscmnts_posted,
    email,
  };
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function RecuriterHome() {
  const { user } = useContext(AuthContext);
  const [userType, setUserType] = useState("Hiring Manager");

  const [usersData, setUsersData] = useState([]);
  const [rows, setRows] = useState([]);

  const [sortBy, setSortBy] = useState("-avg_rec_rating_received");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const USERS_PER_PAGE = 15;

  const [openAlert, setOpenAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseAlert = () => {
    setOpenAlert(false);
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

  useEffect(() => {
    fetch(
      `${API_ENDPOINT}/hiringmanager/fetch_latest_aggregated_user_data?` +
        `sort_by=${sortBy}&cur_page=${page}&single_page_count=${USERS_PER_PAGE}`
    )
      .then((response) => response.json())
      .then((data) => {
        setTotalPage(Math.ceil(data.total_user_count / USERS_PER_PAGE));
        setUsersData(data.user_data);
      })
      .catch((error) => console.error(error));
  }, [sortBy, page, openAlert]);

  useEffect(() => {
    let newRows = [];
    usersData.map((user) => {
      return newRows.push(
        createData(
          user.fields.username,
          user.fields.avg_rec_rating_received,
          user.fields.num_exp_posted,
          user.fields.num_rec_posted,
          user.fields.num_codes_posted,
          user.fields.num_totalcmnts_posted,
          user.fields.num_expcmnts_posted,
          user.fields.num_anscmnts_posted,
          user.fields.email
        )
      );
    });
    setRows(newRows);
  }, [usersData]);

  const refreshUserData = () => {
    fetch(`${API_ENDPOINT}/hiringmanager/refresh_user_metadata`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setOpenAlert(true);
          setAlertMessage("User data refresh successfully");
          setAlertStatus("success");
        } else {
          setOpenAlert(true);
          setAlertMessage(data.error_msg);
          setAlertStatus("error");
          return;
        }
      })
      .catch((error) => console.error(error));
  };

  const navigate = useNavigate();
  if (userType !== "Hiring Manager") {
    navigate("/");
  }

  const handlePageChange = (event, value) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setPage(value);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseAlert}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <Navbar />

      <Box sx={{ padding: 2 }}>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}
        >
          
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, color: "#57068c" }}
          >
            Top Users
          </Typography>
        
          <Button
            variant="contained"
            sx={{ width: 150 }}
            style={{
              textTransform: "none",
              backgroundColor: "#9B5EA2",
              height: 40,
            }}
            onClick={refreshUserData}
          >
             <RefreshIcon/>
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <Typography variant="h6">Username</Typography>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    onClick={() => {
                      setSortBy("-avg_rec_rating_received");
                    }}
                  >
                    <Stack direction={"row"}>
                      <Typography variant="h6">
                        Average rating received
                      </Typography>
                      {sortBy === "-avg_rec_rating_received" && (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </Stack>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    onClick={() => {
                      setSortBy("-num_exp_posted");
                    }}
                  >
                    <Stack direction={"row"}>
                      <Typography variant="h6">experience posted</Typography>
                      {sortBy === "-num_exp_posted" && (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </Stack>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    onClick={() => {
                      setSortBy("-num_rec_posted");
                    }}
                  >
                    <Stack direction={"row"}>
                      <Typography variant="h6">recording posted</Typography>
                      {sortBy === "-num_rec_posted" && (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </Stack>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    onClick={() => {
                      setSortBy("-num_codes_posted");
                    }}
                  >
                    <Stack direction={"row"}>
                      <Typography variant="h6">codes posted</Typography>
                      {sortBy === "-num_codes_posted" && (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </Stack>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    onClick={() => {
                      setSortBy("-num_totalcmnts_posted");
                    }}
                  >
                    <Stack direction={"row"}>
                      <Typography variant="h6">comments posted</Typography>
                      {sortBy === "-num_totalcmnts_posted" && (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </Stack>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    onClick={() => {
                      setSortBy("-num_expcmnts_posted");
                    }}
                  >
                    <Stack direction={"row"}>
                      <Typography variant="h6">
                        experience comments posted
                      </Typography>
                      {sortBy === "-num_expcmnts_posted" && (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </Stack>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <div
                    onClick={() => {
                      setSortBy("-num_anscmnts_posted");
                    }}
                  >
                    <Stack direction={"row"}>
                      <Typography variant="h6">
                        answer comments posted
                      </Typography>
                      {sortBy === "-num_anscmnts_posted" && (
                        <KeyboardArrowDownOutlinedIcon />
                      )}
                    </Stack>
                  </div>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <StyledTableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell>
                    <Link to={`/profile/${row.email}`}>
                      <Typography variant="subtitle1">
                        {row.username}
                      </Typography>
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.avg_rec_rating_received}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.num_exp_posted}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.num_rec_posted}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.num_codes_posted}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.num_totalcmnts_posted}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.num_expcmnts_posted}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.num_anscmnts_posted}
                  </StyledTableCell>
                </StyledTableRow>
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

        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          action={action}
          onClose={handleCloseAlert}
        >
          <Alert onClose={handleCloseAlert} severity={alertStatus}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default RecuriterHome;
