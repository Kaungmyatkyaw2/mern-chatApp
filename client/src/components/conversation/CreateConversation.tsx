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
import { useCreateConversationMutation } from "../../store/slices/api/endpoints/conversation.endpoints";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getConversations } from "../../store/slices/conversation.slice";
import { getUser } from "../../store/slices/auth.slice";
import { User } from "../../types/user.types";
import ErrorSnackbar from "../others/ErrorSnackbar";
import { Conversation } from "../../types/conversations.types";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
}

const checkIsAlreadyInChat = (
  conversations: Conversation[],
  user: User
): [Conversation | undefined, Boolean] => {
  const converWithUser = conversations.find(
    (el) => !el.isGroup && el.members.map((me) => me._id).includes(user._id)
  );

  const isAlreadyChat =
    conversations.findIndex((el) => !el.isGroup && !!converWithUser) !== -1;

  return [converWithUser, isAlreadyChat];
};

export const CreateConversation = ({ open, setOpen, socket }: Props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [createConversation, createConversationMutation] =
    useCreateConversationMutation();
  const getUsersQuery = useGetUsersQuery(email || "", {
    skip: !email,
  });
  const users = !email ? [] : getUsersQuery.data?.data;

  const conversations = useSelector(getConversations);
  const me = useSelector(getUser);

  useEffect(() => {
    setEmail("");
  }, [open]);

  const buttonText = (user: User) => {
    const [_, isAlreadyChat] = checkIsAlreadyInChat(conversations, user);
    return user._id == me?._id ? "Me" : isAlreadyChat ? "Chat" : "Add";
  };

  const handleCreate = async (user: User) => {
    try {
      const [converWithUser, isAlreadyChat] = checkIsAlreadyInChat(
        conversations,
        user
      );

      if (me?._id !== user._id) {
        if (isAlreadyChat) {
          setOpen(false);
          navigate(`/conversations/${converWithUser?._id}`);
        } else {
          const res = await createConversation({
            members: [user.email],
          }).unwrap();
          socket?.emit("createConversation", res.data);
          setOpen(false);
          navigate(`/conversations/${res.data._id}`);
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
          (createConversationMutation.error as { data: { message: string } })
            ?.data?.message
        }
      />
      <Dialog open={open} disableEscapeKeyDown>
        <DialogTitle>Search Users</DialogTitle>
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
                  disabled={createConversationMutation.isLoading}
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
