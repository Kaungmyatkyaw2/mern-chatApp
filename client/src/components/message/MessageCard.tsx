import { useSelector } from "react-redux";
import { getUser } from "../../store/slices/auth.slice";
import { Message } from "../../types/message.types";
import { Box, Typography } from "@mui/material";
import UserAvatar from "../conversation/UserAvatar";

export const MessageCard = ({
  msg,
  isGroup,
}: {
  msg: Message;
  isGroup?: boolean;
}) => {
  const user = useSelector(getUser);

  const isUserSent = msg.sender._id == user?._id;

  const displayText = (inputText: string) => {
    const formattedText = inputText.replace(/\n/g, "<br>");

    return { __html: formattedText };
  };

  return (
    <Box
      key={msg._id}
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: isUserSent ? "end" : "start",
        alignItems: "center",
        flexDirection: isUserSent ? "row-reverse" : "row",
        mt: "15px",
      }}
    >
      {isGroup ? (
        <Box sx={isUserSent ? { ml: "10px" } : { mr: "10px" }}>
          <UserAvatar name={msg.sender.name} width={40} height={40} />
        </Box>
      ) : (
        ""
      )}
      <Box
        sx={{
          maxWidth: "80%",
          bgcolor: msg.sender._id == user?._id ? "lightskyblue" : "whitesmoke",
          px: "15px",
          py: "15px",
          borderRadius: "10px",
        }}
      >
        <Typography variant="subtitle2">
          <div dangerouslySetInnerHTML={displayText(msg.text)}></div>
        </Typography>
      </Box>
    </Box>
  );
};
