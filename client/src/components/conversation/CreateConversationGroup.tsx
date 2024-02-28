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
  Stack,
  Chip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetUsersQuery } from "../../store/slices/api/endpoints/user.endpoints";
import { UserCard } from "../users";
import { User } from "../../types/user.types";
import UserAvatar from "./UserAvatar";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { useCreateConversationMutation } from "../../store/slices/api/endpoints/conversation.endpoints";
import ErrorSnackbar from "../others/ErrorSnackbar";
import { useSelector } from "react-redux";
import { getUser } from "../../store/slices/auth.slice";
import { Socket } from "socket.io-client";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
}

export const CreateConversationGroup = ({ open, setOpen, socket }: Props) => {
  const me = useSelector(getUser);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [showSnackBar, setShowSnackBar] = useState(false);

  const navigate = useNavigate();
  const [createConversation, createConversationMutation] =
    useCreateConversationMutation();
  const getUsersQuery = useGetUsersQuery(email || "", {
    skip: !email,
  });

  useEffect(() => {
    setEmail("");
    setName("");
    setMembers([]);
  }, [open]);

  const users = !email ? [] : getUsersQuery.data?.data;

  const addOrRemoveMember = (mem: User) => {
    if (mem._id == me?._id) {
      return;
    }

    const isAlreadyExist = members.findIndex((el) => el._id == mem._id) != -1;

    if (isAlreadyExist) {
      setMembers((prev) => prev.filter((el) => el._id !== mem._id));
    } else {
      setMembers((prev) => [...prev, mem]);
    }
  };

  const getUserCardBtnText = (mem: User): string => {
    const isAlreadyExist = members.findIndex((el) => el._id == mem._id) != -1;

    if (mem._id == me?._id) {
      return "You";
    }

    if (isAlreadyExist) {
      return "Remove";
    } else {
      return "Add";
    }
  };

  const handleCreate = async () => {
    try {
      const res = await createConversation({
        members: members.map((el) => el.email),
        name,
        isGroup: true,
      }).unwrap();
      socket?.emit("createConversation", res.data);
      setOpen(false);
      navigate(`/conversations/${res.data._id}`);
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
        <DialogTitle>Create Group</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a conversation group , you have to collect your friend
            account
          </DialogContentText>
          <TextField
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
            margin="dense"
            id="name"
            name="Group Name"
            label="Group Name"
            type="text"
            fullWidth
            variant="standard"
            sx={{ mt: "20px" }}
            value={name}
          />
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
            sx={{ my: "20px" }}
          />
          <Stack direction="row" spacing={1}>
            {members.map((el) => (
              <Chip
                label={el.name}
                key={el._id}
                avatar={<UserAvatar user={el} />}
                onDelete={() => {
                  setMembers((prev) =>
                    prev.filter((mem) => mem._id !== el._id)
                  );
                }}
              />
            ))}
          </Stack>

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
              users?.map((el) => (
                <UserCard
                  onClick={() => {
                    addOrRemoveMember(el);
                  }}
                  customText={getUserCardBtnText(el)}
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
          <LoadingButton
            loading={createConversationMutation.isLoading}
            color="primary"
            variant="outlined"
            sx={{ width: "100px" }}
            disabled={
              !members.length || !name || createConversationMutation.isLoading
            }
            onClick={handleCreate}
          >
            Create
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
