import { Box, IconButton, TextField, Typography } from "@mui/material";
import { ArrowBack, Send } from "@mui/icons-material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useGetConversationQuery } from "../store/slices/api/endpoints/conversation.endpoints";
import useGetMember from "../hooks/useGetMember";
import UserAvatar from "../components/conversation/UserAvatar";
import {
  useCreateMessageMutation,
  useGetMessagesQuery,
} from "../store/slices/api/endpoints/message.endpoints";
import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { getUser } from "../store/slices/auth.slice";

export const Chat = () => {
  const { socket } = useOutletContext<{ socket: Socket | null }>();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);

  const chatDisplay = useRef<HTMLDivElement>(null);

  const user = useSelector(getUser);
  const conversationQuery = useGetConversationQuery(id || "");
  const otherUser = useGetMember(conversationQuery.data?.data);

  const [sendMessage, createMessageMutation] = useCreateMessageMutation();
  const messagesQuery = useGetMessagesQuery({ id: id as string, page });
  const navigate = useNavigate();

  useEffect(() => {
    if (chatDisplay.current == null) return;
    const el = chatDisplay.current;

    const fn = async () => {
      if (messagesQuery.data?.results == 10 && !messagesQuery.isFetching) {
        setPage((prev) => prev + 1);
      }
    };
    const onScroll = async () => {
      if (el.scrollTop < 30) {
        await fn();
      }
    };

    el.addEventListener("scroll", onScroll);

    return () => el.removeEventListener("scroll", onScroll);
  }, [messagesQuery]);

  useEffect(() => {
    if (chatDisplay.current) {
      chatDisplay.current.scrollTop = chatDisplay.current?.scrollHeight || 0;
    }
  }, [messagesQuery.data]);

  const onSendMessage = async () => {
    try {
      if (message) {
        const res = await sendMessage({
          conversation: id,
          text: message,
        }).unwrap();

        socket?.emit("sendMessage", res.data);
      }
    } catch (error) {}
  };

  return (
    <Box width={"100%"} height={"100vh"}>
      {conversationQuery.isLoading ? (
        <h1>Loading....</h1>
      ) : (
        <>
          <Box
            sx={{
              height: "70px",
              width: "full",
              px: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: 1,
              borderColor: "#DCDCDC",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <UserAvatar user={otherUser} />
              <Box>
                <Typography fontWeight={"bold"} fontSize={"18px"}>
                  {otherUser?.name}
                </Typography>
                <Typography fontSize={"13px"}>Active</Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => {
                navigate("/conversations");
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>
          <Box
            sx={{
              height: "calc(100% - 142px)",
              overflowY: "scroll",
              px: "20px",
            }}
            ref={chatDisplay}
          >
            <Box sx={{ pt: "5px", pb: "20px" }}>
              {messagesQuery.isLoading ? (
                <></>
              ) : (
                messagesQuery.data?.data.map((msg) => (
                  <Box
                    key={msg._id}
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent:
                        msg.sender._id == user?._id ? "end" : "start",
                      mt: "15px",
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "80%",
                        bgcolor:
                          msg.sender._id == user?._id
                            ? "lightskyblue"
                            : "whitesmoke",

                        px: "15px",
                        py: "15px",
                        borderRadius: "10px",
                      }}
                    >
                      <Typography variant="subtitle2">{msg.text}</Typography>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
          <Box
            sx={{
              width: "full",
              height: "70px",
              px: "20px",
              display: "flex",
              alignItems: "center",
              borderTop: 1,
              borderColor: "#DCDCDC",
            }}
          >
            <TextField
              sx={{ width: "100%" }}
              id="standard-basic"
              variant="standard"
              placeholder="Message..."
              onChange={(e) => setMessage(e.target.value)}
            />
            <LoadingButton
              loading={createMessageMutation.isLoading}
              onClick={onSendMessage}
              sx={{ width: "50px", height: "50px" }}
            >
              <Send />
            </LoadingButton>
          </Box>
        </>
      )}
    </Box>
  );
};
