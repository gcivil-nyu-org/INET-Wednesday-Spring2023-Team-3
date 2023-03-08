import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Navbar from "./navbar";

function UploadQuestion() {
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
                multiline
                style={{ width: "100%", marginTop: 15 }}
              />
            </div>
            <div>
              <TextField
                required
                id="outlined-multiline-static"
                label="Description"
                multiline
                style={{ width: "100%", marginTop: 15 }}
              />
            </div>
            <div>
              <TextField
                label="Type"
                style={{ width: "23%", marginTop: 15, marginRight: 15 }}
              />
              <TextField
                label="Company"
                style={{ width: "23%", marginTop: 15, marginRight: 15 }}
              />
              <TextField
                label="Position"
                style={{ width: "23%", marginTop: 15, marginRight: 15 }}
              />
              <TextField
                label="Difficulty"
                style={{ width: "23%", marginTop: 15 }}
              />
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
            </div>
          </Box>
          <br />
        </div>
      </div>
    </div>
  );
}

export default UploadQuestion;
