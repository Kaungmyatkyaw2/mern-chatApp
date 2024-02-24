import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Conversation } from "../../types/conversations.types";
import UserAvatar from "./UserAvatar";
import useGetMember from "../../hooks/useGetMember";
import GroupAvatar from "./GroupAvatar";

interface Props {
  conversation: Conversation;
}

export const ConversationCard = ({ conversation }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const otherUser = useGetMember(conversation);

  const lastMessageCreatedAt = new Date(
    "" + conversation.lastMessage?.createdAt
  );
  const lastMessageDate = conversation.lastMessage
    ? lastMessageCreatedAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const lastMsgText = conversation.lastMessage
    ? conversation.lastMessage?.text?.length > 30
      ? conversation.lastMessage?.text.substring(0, 30) + "..."
      : conversation.lastMessage?.text
    : "Start chatting now.";

  let bgcolor = location.pathname.trim().endsWith(conversation._id)
    ? "whiteSmoke"
    : "white";

  return (
    <Box
      onClick={() => {
        navigate(`/conversations/${conversation._id}`);
      }}
      bgcolor={bgcolor}
      sx={{
        display: "flex",
        alignItems: "center",
        py: "15px",
        px: "10px",
        borderRadius: "7px",
        gap: "10px",
        mb: "5px",
        cursor: "pointer",
        "&:hover": {
          background: "whiteSmoke",
        },
      }}
    >
      {conversation.isGroup ? (
        <GroupAvatar members={conversation.members} />
      ) : (
        <UserAvatar name={otherUser?.name} width={55} height={55} />
      )}

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
            {conversation.isGroup ? conversation.name : otherUser?.name || ""}
          </Typography>
          <Typography variant="subtitle2">{lastMessageDate}</Typography>
        </Box>
        <Typography variant="subtitle1">{lastMsgText}</Typography>
      </Box>
    </Box>
  );
};
