import React from "react";
import { Snackbar, Alert } from "@mui/material";

const Toast = ({
  isSnackOpen,
  setIsSnackOpen,
  snackMessage = { type: "", message: "" },
}) => {
  return (
    <Snackbar
      key="snackToast"
      open={isSnackOpen}
      autoHideDuration={3000}
      onClose={() => setIsSnackOpen(false)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={() => setIsSnackOpen(false)}
        severity={snackMessage.type || "info"}
        sx={{ width: "100%" }}
      >
        {snackMessage.message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
