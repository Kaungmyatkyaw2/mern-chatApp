import { Box, Modal, Typography } from "@mui/material";
import { Conversation } from "../../types/conversations.types";
import useGetMember from "../../hooks/useGetMember";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import { UserCard } from "../users";
import React, { useState } from "react";
import { User } from "../../types/user.types";
import { useAddAdminMutation } from "../../store/slices/api/endpoints/conversation.endpoints";
import { Socket } from "socket.io-client";
import ErrorSnackbar from "../others/ErrorSnackbar";

interface Props {
  open: boolean;
  conversation: Conversation | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    sm: 400,
    xs: 300,
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const ConversationDetailModal = ({
  conversation,
  setOpen,
  socket,
  ...props
}: Props) => {
  const otherUser = useGetMember(conversation);
  const [addAdmin, addAdminMutation] = useAddAdminMutation();
  const [showError, setShowError] = useState(false);

  if (!conversation) return null;

  let currentDate = new Date();

  let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  let day = currentDate.getDate().toString().padStart(2, "0");
  let year = currentDate.getFullYear();

  let formattedDate = `${month},${day},${year}`;

  const buttonText = (user: User) => {
    return conversation.admins.includes(user._id) ? "Admin" : "Member";
  };

  const handleCreate = async (user: User) => {
    try {
      if (conversation.admins.includes(user._id)) {
        return;
      }

      const res = await addAdmin({
        convId: conversation?._id || "",
        admin: user._id,
      }).unwrap();
      socket?.emit("leaveConversation", res.data);
    } catch {
      setShowError(true);
    }
  };

  return (
    <>
      <ErrorSnackbar
        show={showError}
        setShow={setShowError}
        msg={
          (addAdminMutation.error as { data: { message: string } })?.data
            ?.message
        }
      />
      <Modal
        {...props}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {conversation.isGroup ? (
              <GroupAvatar members={conversation.members} />
            ) : (
              <UserAvatar user={otherUser} />
            )}
            <Typography fontWeight={"bold"} fontSize={"18px"}>
              {conversation.isGroup ? conversation.name : otherUser?.name || ""}
            </Typography>
          </Box>
          {!conversation.isGroup && (
            <Typography
              variant="subtitle1"
              color={"green"}
              sx={{ textAlign: "center", fontWeight: "bold", py: "5px" }}
            >
              {otherUser?.email}
            </Typography>
          )}
          <Typography
            variant="subtitle2"
            color={"gray"}
            sx={{ textAlign: "center" }}
          >
            Created At {formattedDate}
          </Typography>

          {conversation.isGroup && (
            <Box sx={{ mt: "20px" }}>
              {conversation.members?.map((el) => (
                <UserCard
                  disabled={
                    addAdminMutation.isLoading &&
                    addAdminMutation.originalArgs?.admin == el._id
                  }
                  onClick={() => {
                    handleCreate(el);
                  }}
                  customText={buttonText(el)}
                  user={el}
                  key={el._id}
                />
              ))}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};
