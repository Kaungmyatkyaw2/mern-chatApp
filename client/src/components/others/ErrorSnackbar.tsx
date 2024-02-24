import { Alert, Snackbar } from "@mui/material";
import React from "react";

const ErrorSnackbar = ({
  show,
  setShow,
  msg,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  msg: string;
}) => {
  const handleSnackBarClose = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShow(false);
  };
  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      open={show}
      autoHideDuration={5000}
      onClose={handleSnackBarClose}
    >
      <Alert
        onClose={handleSnackBarClose}
        severity="error"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {msg}
      </Alert>
    </Snackbar>
  );
};

export default ErrorSnackbar;
