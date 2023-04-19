import * as React from "react";
import Navbar from "../Components/navbar";
import { API_ENDPOINT } from "../Components/api";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TuneIcon from "@mui/icons-material/Tune";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";


function QuickStart() {
  const navigate = useNavigate();
  let metadataURL = `${API_ENDPOINT}/questions/metadata`;

  const [formData, setFormData] = useState({
    number_of_behavioural_questions: 0,
    number_of_coding_questions: 0,
    company: "",
    time_limit: 0,
    metadata: "",
    selectedCompany: "",
    position: "",
    selectedPosition: ""
  });

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const response = await fetch(metadataURL);
        const metadata = await response.json();
        setFormData((prevState) => ({ ...prevState, metadata }));
        setFormData((prevState) => ({ ...prevState, company: Object.keys(metadata.metadata) }));

      } catch (error) {
        console.error(error);
      }
    }
    fetchMetadata();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/mock-interview', { state: formData });
  };
  
  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "selectedCompany") {
      const selectedCompanyMetadata = formData.metadata.metadata[value];
      setFormData((prevState) => ({
        ...prevState,
        selectedCompany: value,
        position: selectedCompanyMetadata
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const theme = createTheme();

  return (
    <>
      <Navbar />
      <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <TuneIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Quick Start
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="input-label-company-selection">
                      Company
                    </InputLabel>
                    <Select
                      required
                      name="selectedCompany"
                      label="Company"
                      value={formData.selectedCompany}
                      onChange={handleInputChange}
                      autoWidth
                      autoFocus
                    > 
                    {Object.keys(formData.company).map((item) => (
                      <MenuItem value={formData.company[item]}>
                        {formData.company[item]}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="input-label-position-selection">
                      Position
                    </InputLabel>
                    <Select
                      required
                      name="selectedPosition"
                      label="Position"
                      value={formData.selectedPosition}
                      onChange={handleInputChange}
                      autoWidth
                      autoFocus
                    > 
                    {Object.keys(formData.position).map((item) => (
                      <MenuItem value={formData.position[item]}>
                        {formData.position[item]}
                      </MenuItem>
                    ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="number_of_coding_questions"
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                    label="Number of coding questions"
                    value={formData.number_of_coding_questions}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="number_of_behavioural_questions"
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                    label="Number of behavioural questions"
                    value={formData.number_of_behavioural_questions}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="time_limit"
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                    label="Enter time limit in minutes"
                    value={formData.time_limit}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Start
              </Button>
            </Box>
          </Box>
      </Container>
      </ThemeProvider>

    </>
  );
}

export default QuickStart;
