import { LoadingButton } from "@mui/lab";
import { Box, TextField } from "@mui/material";
import { useCreateMessageMutation } from "../../store/slices/api/endpoints/message.endpoints";
import { Socket } from "socket.io-client";
import { useOutletContext, useParams } from "react-router-dom";
import { useState } from "react";
import { Send } from "@mui/icons-material";

export const MessageSendInput = () => {
  const { id } = useParams();
  const { socket } = useOutletContext<{ socket: Socket | null }>();
  const [message, setMessage] = useState("");
  const [sendMessage, createMessageMutation] = useCreateMessageMutation();
  const onSendMessage = async () => {
    try {
      if (message) {
        const res = await sendMessage({
          conversation: id,
          text: message,
        }).unwrap();
        setMessage("");

        socket?.emit("sendMessage", res.data);
      }
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        width: "full",
        height: "80px",
        px: "20px",
        display: "flex",
        alignItems: "center",
        borderTop: 1,
        borderColor: "#DCDCDC",
      }}
    >
      <TextField
        maxRows={2}
        sx={{ width: "100%" }}
        id="standard-basic"
        variant="standard"
        placeholder="Message..."
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        multiline
      />
      <LoadingButton
        loading={createMessageMutation.isLoading}
        onClick={onSendMessage}
        sx={{ width: "50px", height: "50px" }}
      >
        <Send />
      </LoadingButton>
    </Box>
  );
};
