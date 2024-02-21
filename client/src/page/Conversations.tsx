import { Box, Grid, IconButton, Typography } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Outlet, useLocation } from "react-router-dom";
import { PersonAdd } from "@mui/icons-material";
import { useGetConversationsQuery } from "../store/slices/api/endpoints/conversation.endpoints";
import {
  ConversationCard,
  CreateConversation,
} from "../components/conversation";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../store/slices/auth.slice";
import { Conversation } from "../types/conversations.types";
import { addNewMessage } from "../store/slices/api/endpoints/message.endpoints";
import { Message } from "../types/message.types";

let socket: undefined | Socket;

export const Conversations = () => {
  const location = useLocation();
  const isInChat = !location.pathname.endsWith("conversations");
  const { data, isLoading } = useGetConversationsQuery();
  const [open, setOpen] = useState(false);
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  useEffect(() => {
    socket = io("http://localhost:3000/");
    socket.emit("connected", { userId: user?._id });
    socket.on("receiveMessage", (data: Message) => {
      //@ts-ignore
      dispatch(addNewMessage(data, data.conversation as string));
    });
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Grid container sx={{ p: 0, m: 0 }}>
        <Grid
          item
          md={4}
          sm={6}
          xs={!isInChat ? 12 : 0}
          sx={{
            borderRight: 1,
            borderColor: "#DCDCDC",
            height: "100vh",
            overflowY: "scroll",
            display: {
              sm: "grid",
              xs: !isInChat ? "grid" : "none",
            },
          }}
        >
          <Box sx={{ p: "15px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: "10px",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Message
              </Typography>
              <Box>
                <IconButton onClick={handleOpen}>
                  <PersonAdd />
                </IconButton>

                <IconButton sx={{ ml: "10px" }}>
                  <GroupAddIcon />
                </IconButton>
              </Box>
            </Box>
            {isLoading ? (
              <h1>Loading</h1>
            ) : (
              data?.data.map((con: Conversation) => (
                <ConversationCard key={con._id} conversation={con} />
              ))
            )}
          </Box>
        </Grid>
        <Grid
          item
          md={8}
          sm={6}
          xs={isInChat ? 12 : 0}
          sx={{
            height: "100vh",
            display: {
              sm: "grid",
              xs: isInChat ? "grid" : "none",
            },
          }}
        >
          <Outlet
            context={{ socket } satisfies { socket: Socket | undefined }}
          />
        </Grid>
      </Grid>
      <CreateConversation setOpen={setOpen} open={open} />
    </>
  );
};
