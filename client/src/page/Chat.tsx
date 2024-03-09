import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { ArrowBack, Error } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetConversationQuery } from "../store/slices/api/endpoints/conversation.endpoints";
import useGetMember from "../hooks/useGetMember";
import UserAvatar from "../components/conversation/UserAvatar";
import {
  addNewMessage,
  useGetMessagesQuery,
} from "../store/slices/api/endpoints/message.endpoints";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCard, MessageSendInput } from "../components/message";
import GroupAvatar from "../components/conversation/GroupAvatar";
import { ConversationDetailModal } from "../components/conversation";
import { ConversationMenu } from "../components/conversation";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Message } from "../types/message.types";
import { useDispatch } from "react-redux";

const ChatLoading = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        py: "20px",
      }}
    >
      <CircularProgress size={30} />
    </Box>
  );
};

const ConversationLoading = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "80%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <CircularProgress size={30} />
      <Typography>Please wait....</Typography>
    </Box>
  );
};

export const Chat = () => {
  const { id } = useParams();

  const [page, setPage] = useState(1);

  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const chatDisplay = useRef<HTMLDivElement>(null);

  const chatEndDisplay = useRef<HTMLDivElement>(null);

  const conversationQuery = useGetConversationQuery(id || "");

  const otherUser = useGetMember(conversationQuery.data?.data);

  const messagesQuery = useGetMessagesQuery({ id: id as string, page });

  const navigate = useNavigate();

  const { socket } = useOutletContext<{ socket: Socket | undefined }>();

  const dispatch = useDispatch();

  const conversation = conversationQuery.data?.data;
  const messages = messagesQuery.data?.data;

  useEffect(() => {
    socket?.on("receiveMessage", (data: Message) => {
      if (typeof data.conversation == "object") {
        if (data.conversation._id == id) {
          //@ts-ignore
          dispatch(addNewMessage(data, data.conversation._id));
          chatEndDisplay.current?.scrollIntoView();
        }
      }
    });
  }, []);

  useEffect(() => {
    if (messagesQuery.originalArgs?.page == 1) {
      chatEndDisplay.current?.scrollIntoView();
    }
  }, [messagesQuery.data]);

  const onLoadMore = useCallback(() => {
    if (messagesQuery.data?.results == 10 && !messagesQuery.isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [messagesQuery]);

  const handleOpenDetailModal = () => {
    setDetailModalOpen(true);
  };

  if (conversationQuery.isError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Error />
        <Typography>Something went wrong!</Typography>
      </Box>
    );
  }

  return (
    <>
      <ConversationDetailModal
        socket={socket}
        conversation={conversation}
        open={detailModalOpen}
        setOpen={setDetailModalOpen}
      />
      <Box width={"100%"} height={"100vh"}>
        {conversationQuery.isLoading ? (
          <ConversationLoading />
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
                {conversation?.isGroup ? (
                  <GroupAvatar
                    onClick={handleOpenDetailModal as any}
                    members={conversation?.members}
                  />
                ) : (
                  <UserAvatar
                    onClick={handleOpenDetailModal}
                    user={otherUser}
                    width={55}
                    height={55}
                  />
                )}
                <Box>
                  <Typography fontWeight={"bold"} fontSize={"18px"}>
                    {conversation?.isGroup
                      ? conversation?.name
                      : otherUser?.name}{" "}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton
                  onClick={() => {
                    navigate("/conversations");
                  }}
                >
                  <ArrowBack />
                </IconButton>
                <ConversationMenu socket={socket} conversation={conversation} />
              </Box>
            </Box>
            <Box
              sx={{
                height: "calc(100% - 152px)",
                overflowY: "scroll",
                px: "20px",
              }}
              ref={chatDisplay}
            >
              <Box
                sx={{ display: "flex", justifyContent: "center", py: "10px" }}
              >
                {!messagesQuery.isFetching &&
                  messagesQuery.data?.results == 10 && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={onLoadMore}
                    >
                      See more
                    </Button>
                  )}
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "center", py: "10px" }}
              >
                {messagesQuery.isFetching && <CircularProgress size={15} />}
              </Box>
              <Box sx={{ pt: "5px", pb: "20px" }}>
                {messagesQuery.isLoading ? (
                  <ChatLoading />
                ) : (
                  messages?.map((msg) => (
                    <MessageCard
                      isGroup={conversation?.isGroup}
                      msg={msg}
                      key={msg._id}
                    />
                  ))
                )}
              </Box>
              <div ref={chatEndDisplay} />
            </Box>
            <MessageSendInput socket={socket} />
          </>
        )}
      </Box>
    </>
  );
};
