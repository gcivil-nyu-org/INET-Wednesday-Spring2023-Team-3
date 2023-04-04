import { useState } from "react";
import * as React from "react";

import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MuiAlert from "@mui/material/Alert";

import { API_ENDPOINT } from "../Components/api";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function UploadVideoDialog({ onClose, open, questionId }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("success");
  const [alertMessage, setAlertMessage] = useState("Upload successful");

  const handleClose = () => {
    onClose();
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadClickSuccess = () => {
    let formData = new FormData();
    formData.append("title", title);
    formData.append("question", questionId);
    formData.append("file", file);

    fetch(`${API_ENDPOINT}/answerrecording/`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));

    setOpenAlert(true);
    setAlertStatus("success");
    setAlertMessage("Upload successful");
    onClose();
  };

  const handleUploadClickError = () => {
    setOpenAlert(true);
    setAlertMessage("Please enter a tilte and upload a file");
    setAlertStatus("error");
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
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
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Upload your answer!</DialogTitle>

        <Box
          sx={{
            width: 300,
            height: 200,
            margin: 3,
          }}
        >
          <Stack spacing={2}>
            <TextField
              id="outlined-basic"
              label="Please enter your answer's title"
              variant="outlined"
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <input type="file" onChange={handleFileChange} />
          </Stack>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                if (!file || title == "") {
                  handleUploadClickError();
                } else {
                  handleUploadClickSuccess();
                }
              }}
              style={{
                textTransform: "none",
              }}
            >
              Upload
            </Button>
          </Box>
        </Box>
      </Dialog>

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
    </>
  );
}

function UploadVideoButton({ questionId }) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClickOpen}
        style={{
          textTransform: "none",
        }}
      >
        Upload your answer!
      </Button>

      <UploadVideoDialog
        open={open}
        onClose={handleClose}
        questionId={questionId}
      />
    </>
  );
}

export default UploadVideoButton;
