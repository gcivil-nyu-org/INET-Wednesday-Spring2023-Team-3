import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

import Navbar from "./navbar";

function UploadQuestion() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    companies: "",
    categories: "",
    difficulty: "",
    positions: "",
    type: "",
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("https://nyuprepapi.com/api/post-question/ ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Question uploaded successfully!");
        console.log(data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
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
            width: "50vw",
            marginTop: "2vh",
            marginBottom: "2vh",
            padding: 30,
          }}
        >
          <Box component="form">
            <Typography variant="h6">
              Please enter question's detail:
            </Typography>
            <div>
              <TextField
                required
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                multiline
                style={{ width: "100%", marginTop: 15 }}
              />
            </div>
            <div>
              <TextField
                required
                id="outlined-multiline-static"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                style={{ width: "100%", marginTop: 15 }}
              />
            </div>
            <div>
              <Typography
                variant="subtitle2"
                component="h2"
                style={{ marginTop: 15 }}
              >
                * If you want to enter more than one value, connect them with
                ","
              </Typography>
            </div>
            <div>
              <TextField
                label="Company"
                name="companies"
                value={formData.companies}
                onChange={handleInputChange}
                style={{ width: "48%", marginTop: 15, marginRight: 15 }}
              />
              <TextField
                label="Position"
                name="positions"
                value={formData.positions}
                onChange={handleInputChange}
                style={{ width: "48%", marginTop: 15, marginRight: 15 }}
              />
            </div>
            <div>
              <FormControl
                fullWidth
                style={{ width: "32%", marginTop: 15, marginRight: 15 }}
              >
                <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-select-label"
                  id="difficulty-select"
                  label="Difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Not satisfied</MenuItem>
                  <MenuItem value="Beginner">Beginner</MenuItem>
                  <MenuItem value="Easy">Easy</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Medium">Hard</MenuItem>
                  <MenuItem value="Expert">Expert</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                style={{ width: "32%", marginTop: 15, marginRight: 15 }}
              >
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  id="type-select"
                  label="Type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Not satisfied</MenuItem>
                  <MenuItem value="Coding">Coding</MenuItem>
                  <MenuItem value="Behavioural">Behavioural</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Category"
                name="categories"
                value={formData.categories}
                onChange={handleInputChange}
                style={{ width: "32%", marginTop: 15 }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 55,
              }}
            >
              <Button
                variant="contained"
                sx={{ width: 200 }}
                onClick={(event) => {
                  if (
                    formData.title.length === 0 ||
                    formData.description.length === 0
                  ) {
                    alert("Please enter all the required field!");
                  } else {
                    handleSubmit(event);
                  }
                }}
                style={{
                  textTransform: "none",
                  backgroundColor: "#9B5EA2",
                  height: 54,
                  margin: "0 auto",
                }}
              >
                Submit
              </Button>
            </div>
          </Box>
          <br />
        </div>
      </div>
    </div>
  );
}

export default UploadQuestion;
