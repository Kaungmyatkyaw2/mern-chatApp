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
import {
  deleteConversation,
  useLeaveConversationMutation,
} from "../../store/slices/api/endpoints/conversation.endpoints";
import { Conversation } from "../../types/conversations.types";
import ErrorSnackbar from "../others/ErrorSnackbar";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
  conversation: Conversation | undefined;
}

export const LeaveConversation = ({
  open,
  setOpen,
  conversation,
  socket,
}: Props) => {
  const [leaveConv, { isLoading, error }] = useLeaveConversationMutation();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLeave = async () => {
    try {
      const res = await leaveConv(conversation?._id || "").unwrap();
      socket?.emit("leaveConversation", res.data);
      //@ts-ignore
      dispatch(deleteConversation(conversation));

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
        <DialogTitle>Do you wanna leave this conversation?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can added by adming even after you left
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
            onClick={handleLeave}
          >
            Leave
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
