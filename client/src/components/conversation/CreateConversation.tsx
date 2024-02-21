import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useCreateConversationMutation } from "../../store/slices/api/endpoints/conversation.endpoints";
import React, { useState } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateConversation = ({ open, setOpen }: Props) => {
  const [createConversation, { isLoading, error }] =
    useCreateConversationMutation();
  const [email, setEmail] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async () => {
    try {
      await createConversation({ members: [email] }).unwrap();
      setOpen(false)
    } catch {
      setShowSnackBar(true);
    }
  };

  const handleSnackBarClose = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackBar(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        open={showSnackBar}
        autoHideDuration={5000}
        onClose={handleSnackBarClose}
      >
        <Alert
          onClose={handleSnackBarClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {(error as { data: { message: string } })?.data?.message}
        </Alert>
      </Snackbar>
      <Dialog open={open} disableEscapeKeyDown>
        <DialogTitle>Create conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a conversation , you have to enter your friend email
          </DialogContentText>
          <TextField
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={isLoading}
            onClick={handleCreate}
            variant={"contained"}
            sx={{ width: "100px" }}
            type="submit"
          >
            Create
          </LoadingButton>
          <Button color="error" sx={{ width: "100px" }} onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
