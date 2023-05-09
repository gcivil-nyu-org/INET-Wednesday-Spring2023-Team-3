import React, { useState, useEffect, useContext } from "react";
import { Box, Button } from "@mui/material";
import Navbar from "./navbar";
import AuthContext from "../context/AuthContext";
import { API_ENDPOINT } from "../Components/api";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";

function Connect() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [type, setType] = useState("name");
  const [search, setSearch] = useState("");
  const [submitSearch, setSubmitSearch] = useState("");

  const [companiesList, setCompaniesList] = useState([]);
  const [company, setCompany] = useState("");
  const [jobPrefList, setJobPrefList] = useState([]);
  const [jobPref, setJobPref] = useState("");

  const USERS_PER_PAGE = 15;

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

  useEffect(() => {
    let url =
      `${API_ENDPOINT}/search-users/?single_page_count=` +
      USERS_PER_PAGE +
      "&cur_page=" +
      page;

    if (type === "name" && submitSearch.length !== 0) {
      url += "&user_name=" + submitSearch;
    } else if (type === "key" && submitSearch.length !== 0) {
      url += "&key=" + submitSearch;
    }
    if (jobPref.length !== 0) {
      url += "&job_pref=" + jobPref;
    }
    if (company.length !== 0) {
      url += "&company=" + company;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.user_data);
        setTotalPage(Math.ceil(data.total_user_count / USERS_PER_PAGE));
        setCompaniesList(data.prev_comp_options);
        setJobPrefList(data.job_pref_options);
      })
      .catch((error) => console.log(error));

    fetch(`${API_ENDPOINT}/friends-list/${user.user_id}`)
      .then((response) => response.json())
      .then((data) => {
        const friendsSet = new Set(data.friends.map((friend) => friend.id));
        setFriends(friendsSet);
      })
      .catch((error) => console.log(error));
  }, [user.user_id, page, type, submitSearch, jobPref, company]);

  const handleAddFriend = (userId) => {
    fetch(`${API_ENDPOINT}/add-friend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id, friend_id: userId }),
    })
      .then(() => {
        setFriends(new Set([...friends, userId]));
      })
      .catch((error) => console.log(error));
  };

  const handleRemoveFriend = (userId) => {
    fetch(`${API_ENDPOINT}/remove-friend/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: user.user_id, friend_id: userId }),
    })
      .then(() => {
        const newFriends = new Set(friends);
        newFriends.delete(userId);
        setFriends(newFriends);
      })
      .catch((error) => console.log(error));
  };
  const handleTypeChange = (event) => {
    setPage(1);
    setType(event.target.value);
  };
  const handleJobPrefChange = (event) => {
    setPage(1);
    setJobPref(event.target.value);
  };
  const handleCompanyChange = (event) => {
    setPage(1);
    setCompany(event.target.value);
  };

  return (
    <div>
      <Navbar />

      <Box sx={{ padding: 2 }}>
        <Stack direction="row" spacing={2} style={{ marginBottom: 10 }}>
          <Box sx={{ minWidth: 200 }}>
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
          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel id="job-select-label">Job Preferences</InputLabel>
              <Select
                labelId="job-select-label"
                id="job-simple-select"
                value={jobPref}
                label="Job Preference"
                onChange={handleJobPrefChange}
              >
                <MenuItem value="">None</MenuItem>
                {jobPrefList.map((job) => (
                  <MenuItem id={job} value={job}>
                    {job}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
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
                <MenuItem value={"name"}>Search by name</MenuItem>
                <MenuItem value={"key"}>Search by keyword</MenuItem>
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
            onClick={() => {
              setPage(1);
              setSubmitSearch(search);
            }}
          >
            Search
          </Button>
        </Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">email</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Companies</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {user.fields.first_name + " " + user.fields.last_name}
                    </TableCell>
                    <TableCell>{user.fields.email}</TableCell>
                    <TableCell>
                      {friends.has(user.pk) ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemoveFriend(user.pk)}
                        >
                          Remove friend
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleAddFriend(user.pk)}
                        >
                          Add friend
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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
    </div>
  );
}

export default Connect;
