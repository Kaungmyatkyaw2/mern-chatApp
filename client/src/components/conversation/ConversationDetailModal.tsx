import { Box, Modal, Typography } from "@mui/material";
import { Conversation } from "../../types/conversations.types";
import useGetMember from "../../hooks/useGetMember";
import UserAvatar from "./UserAvatar";
import GroupAvatar from "./GroupAvatar";
import { UserCard } from "../users";
import React from "react";

interface Props {
  open: boolean;
  conversation: Conversation | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const ConversationDetailModal = ({
  conversation,
  setOpen,
  ...props
}: Props) => {
  const otherUser = useGetMember(conversation);

  if (!conversation) return null;

  let currentDate = new Date();

  let month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  let day = currentDate.getDate().toString().padStart(2, "0");
  let year = currentDate.getFullYear();

  let formattedDate = `${month},${day},${year}`;

  return (
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
                onClick={() => {}}
                customText={"Member"}
                user={el}
                key={el._id}
              />
            ))}
          </Box>
        )}
      </Box>
    </Modal>
  );
};
