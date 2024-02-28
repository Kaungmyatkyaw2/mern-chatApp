import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import { ArrowBack, Error } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetConversationQuery } from "../store/slices/api/endpoints/conversation.endpoints";
import useGetMember from "../hooks/useGetMember";
import UserAvatar from "../components/conversation/UserAvatar";
import { useGetMessagesQuery } from "../store/slices/api/endpoints/message.endpoints";
import { useEffect, useRef, useState } from "react";
import { MessageCard, MessageSendInput } from "../components/message";
import GroupAvatar from "../components/conversation/GroupAvatar";
import { ConversationDetailModal } from "../components/conversation";
import { ConversationMenu } from "../components/conversation";
import { useOutletContext } from "react-router-dom";
import { Socket } from "socket.io-client";

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

export const Chat = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const chatDisplay = useRef<HTMLDivElement>(null);
  const chatEndDisplay = useRef<HTMLDivElement>(null);
  const conversationQuery = useGetConversationQuery(id || "");
  const otherUser = useGetMember(conversationQuery.data?.data);
  const messagesQuery = useGetMessagesQuery({ id: id as string, page });
  const navigate = useNavigate();
  const { socket } = useOutletContext<{ socket: Socket | undefined }>();

  const conversation = conversationQuery.data?.data;
  const messages = messagesQuery.data?.data;

  useEffect(() => {
    if (chatDisplay.current == null) return;
    const el = chatDisplay.current;

    const onScroll = async () => {
      if (el.scrollTop < 30) {
        if (messagesQuery.data?.results == 10 && !messagesQuery.isFetching) {
          setPage((prev) => prev + 1);
        }
      }
      if (el.scrollHeight == el.scrollTop) {
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }
    };

    el.addEventListener("scroll", onScroll);

    return () => el.removeEventListener("scroll", onScroll);
  }, [messagesQuery]);

  useEffect(() => {
    if (!messagesQuery.isFetching) {
      chatEndDisplay.current?.scrollIntoView();
    }
  }, [isScrolled, messagesQuery.data]);

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
        conversation={conversation}
        open={detailModalOpen}
        setOpen={setDetailModalOpen}
      />
      <Box width={"100%"} height={"100vh"}>
        {conversationQuery.isLoading ? (
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
                  <Typography fontSize={"13px"}>Active</Typography>
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
                height: {
                  md: "calc(100% - 152px)",
                  xs: "calc(100% - 202px)",
                },
                overflowY: "scroll",
                px: "20px",
              }}
              ref={chatDisplay}
            >
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
                <div ref={chatEndDisplay} />
              </Box>
            </Box>
            <MessageSendInput socket={socket} />
          </>
        )}
      </Box>
    </>
  );
};
