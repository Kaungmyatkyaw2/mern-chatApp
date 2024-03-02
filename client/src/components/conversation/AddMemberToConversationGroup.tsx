import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Box,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "../../store/slices/api/endpoints/user.endpoints";
import { UserCard } from "../users";
import { Socket } from "socket.io-client";
import { useAddMemberMutation } from "../../store/slices/api/endpoints/conversation.endpoints";
import { useSelector } from "react-redux";
import { getUser } from "../../store/slices/auth.slice";
import { User } from "../../types/user.types";
import ErrorSnackbar from "../others/ErrorSnackbar";
import { Conversation } from "../../types/conversations.types";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
  conversation: Conversation | undefined;
}

const checkIsAlreadyInChat = (
  userId: string | undefined,
  conversations: Conversation | undefined
) => {
  return conversations?.members.some((el) => el._id == userId);
};

export const AddMemberToConversationGroup = ({
  open,
  setOpen,
  socket,
  conversation,
}: Props) => {
  const [email, setEmail] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [addToConversation, addToConversationMutation] = useAddMemberMutation();
  const getUsersQuery = useGetUsersQuery(email || "", {
    skip: !email,
  });
  const users = !email ? [] : getUsersQuery.data?.data;
  const me = useSelector(getUser);

  useEffect(() => {
    setEmail("");
  }, [open]);

  const buttonText = (user: User) => {
    const isAlreadyMember = checkIsAlreadyInChat(user._id, conversation);
    return user._id == me?._id ? "Me" : isAlreadyMember ? "Member" : "Add";
  };

  const handleCreate = async (user: User) => {
    try {
      const isAlreadyMember = checkIsAlreadyInChat(user._id, conversation);

      if (me?._id !== user._id) {
        if (!isAlreadyMember) {
          const res = await addToConversation({
            convId: conversation?._id || "",
            member: user._id,
          }).unwrap();
          socket?.emit("leaveConversation", res.data);
        }
      }
    } catch {
      setShowSnackBar(true);
    }
  };

  return (
    <>
      <ErrorSnackbar
        show={showSnackBar}
        setShow={setShowSnackBar}
        msg={
          (addToConversationMutation.error as { data: { message: string } })
            ?.data?.message
        }
      />
      <Dialog open={open} disableEscapeKeyDown>
        <DialogTitle>Search Users</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a member to conversation , you have to enter your friend
            email
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
            value={email}
          />
          <Box sx={{ mt: "20px" }}>
            {getUsersQuery.isLoading ? (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={20} />
              </Box>
            ) : (
              users?.map((el: User) => (
                <UserCard
                  disabled={
                    addToConversationMutation.isLoading &&
                    addToConversationMutation.originalArgs?.member == el._id
                  }
                  onClick={() => {
                    handleCreate(el);
                  }}
                  customText={buttonText(el)}
                  user={el}
                  key={el._id}
                />
              ))
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="text"
            sx={{ width: "100px" }}
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
