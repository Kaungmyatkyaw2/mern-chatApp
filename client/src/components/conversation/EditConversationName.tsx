import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  DialogContentText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { useUpdateConversationMutation } from "../../store/slices/api/endpoints/conversation.endpoints";
import ErrorSnackbar from "../others/ErrorSnackbar";
import { Conversation } from "../../types/conversations.types";
import { LoadingButton } from "@mui/lab";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
  conversation: Conversation | undefined;
}

export const EditConversationName = ({
  open,
  setOpen,
  conversation,
  socket,
}: Props) => {
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const [updateConv, updateConvMutation] = useUpdateConversationMutation();

  useEffect(() => {
    setName(conversation?.name || "");
  }, [open]);

  const handleUpdate = async () => {
    try {
      if (name) {
        const res = await updateConv({
          id: conversation?._id || "",
          body: { name: name },
        }).unwrap();
        socket?.emit("leaveConversation", res.data);
        setOpen(false);
      }
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <>
      <ErrorSnackbar
        show={showError}
        setShow={setShowError}
        msg={
          (updateConvMutation.error as { data: { message: string } })?.data
            ?.message
        }
      />
      <Dialog open={open} disableEscapeKeyDown>
        <DialogTitle>Edit Conversation Name</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Edit your conversation group name , to make it more cool
          </DialogContentText>
          <TextField
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Group Name"
            type="text"
            fullWidth
            variant="standard"
            value={name}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={updateConvMutation.isLoading}
            color="error"
            variant="text"
            sx={{ width: "100px" }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={updateConvMutation.isLoading}
            disabled={updateConvMutation.isLoading}
            variant="contained"
            sx={{ width: "100px" }}
            onClick={handleUpdate}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
