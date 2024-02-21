import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Conversation } from "../../types/conversations.types";
import UserAvatar from "./UserAvatar";
import useGetMember from "../../hooks/useGetMember";

interface Props {
  conversation: Conversation;
}

export const ConversationCard = ({ conversation }: Props) => {
  const navigate = useNavigate();

  const otherUser = useGetMember(conversation);

  const lastMessageCreatedAt = new Date(""+conversation.lastMessage?.createdAt);
  const lastMessageDate = conversation.lastMessage
    ? lastMessageCreatedAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <Box
      onClick={() => {
        navigate(`/conversations/${conversation._id}`);
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        py: "15px",
        px: "10px",
        borderRadius: "7px",
        gap: "10px",
        cursor: "pointer",
        "&:hover": {
          background: "whiteSmoke",
        },
      }}
    >
      <UserAvatar user={otherUser} width={55} height={55} />

      <Box width={"100%"}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography fontWeight={"bold"} fontSize={"18px"}>
            {otherUser?.name || ""}
          </Typography>
          <Typography variant="subtitle2">{lastMessageDate}</Typography>
        </Box>
        <Typography variant="subtitle1">
          {conversation.lastMessage?.text || "Start chat now!"}
        </Typography>
      </Box>
    </Box>
  );
};
