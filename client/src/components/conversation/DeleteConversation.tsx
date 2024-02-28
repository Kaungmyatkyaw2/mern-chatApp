import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { useDeleteConversationMutation } from "../../store/slices/api/endpoints/conversation.endpoints";
import { Conversation } from "../../types/conversations.types";
import ErrorSnackbar from "../others/ErrorSnackbar";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
  conversation: Conversation | undefined;
}

export const DeleteConversation = ({
  open,
  setOpen,
  conversation,
  socket,
}: Props) => {
  const [deleteConver, { isLoading, error }] = useDeleteConversationMutation();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await deleteConver(conversation?._id || "").unwrap();
      socket?.emit("deleteConversation", conversation);
      navigate("/conversations");
      setOpen(false);
    } catch (error) {
      setShowSnackBar(true);
    }
  };

  return (
    <>
      <ErrorSnackbar
        show={showSnackBar}
        setShow={setShowSnackBar}
        msg={(error as { data: { message: string } })?.data?.message}
      />
      <Dialog open={open} disableEscapeKeyDown>
        <DialogTitle>Delete this conversation?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can't recover a conversation if you delete
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isLoading}
            color="secondary"
            variant="text"
            sx={{ width: "100px" }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            disabled={isLoading}
            loading={isLoading}
            color="error"
            variant="text"
            sx={{ width: "100px" }}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
