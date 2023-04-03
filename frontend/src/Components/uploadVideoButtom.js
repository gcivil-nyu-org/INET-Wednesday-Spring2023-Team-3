import Button from "@mui/material/Button";
function UploadVideoButton({ questionId }) {
  return (
    <>
      <Button
        variant="outlined"
        style={{
          textTransform: "none",
        }}
      >
        Upload your answer!
      </Button>
    </>
  );
}

export default UploadVideoButton;
