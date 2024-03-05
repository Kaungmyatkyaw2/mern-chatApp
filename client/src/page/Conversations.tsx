import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Logout, Person, PersonAdd } from "@mui/icons-material";
import {
  addNewConversation,
  deleteConversation,
  updateConversations,
  updateConversation,
  updateLastMsg,
  useGetConversationsQuery,
} from "../store/slices/api/endpoints/conversation.endpoints";
import {
  ConversationCard,
  CreateConversation,
  CreateConversationGroup,
} from "../components/conversation";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logOut } from "../store/slices/auth.slice";
import { Conversation } from "../types/conversations.types";
import { addNewMessage } from "../store/slices/api/endpoints/message.endpoints";
import { Message } from "../types/message.types";
import UserAvatar from "../components/conversation/UserAvatar";
import { setConversation } from "../store/slices/conversation.slice";
import { useLogoutMutation } from "../store/slices/api/endpoints/auth.endpoints";
import NoData from "../components/others/NoData";
import { ApiSlice } from "../store/slices/api/api.slice";

let socket: undefined | Socket;

export const Conversations = () => {
  const location = useLocation();
  const isInChat = !location.pathname.endsWith("conversations");
  const { id } = useParams();

  const { data, isLoading, isSuccess } = useGetConversationsQuery();
  const conversations = data?.data || [];

  const [openCreateBox, setOpenCreateBox] = useState(false);
  const [openCreateGroupBox, setOpenCreateGroupBox] = useState(false);
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setConversation(data.data));
    }
  }, [isSuccess]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    if (API_URL) {
      socket = io(API_URL);
      socket.emit("connected", { userId: user?._id });
      socket.on("receiveMessage", (data: Message) => {
        //@ts-ignore
        dispatch(addNewMessage(data, data.conversation._id as string));
        //@ts-ignore
        dispatch(updateLastMsg(data, data.conversation._id as string));
      });
      socket.on("receiveNewConversation", (data: Conversation) => {
        //@ts-ignore
        dispatch(addNewConversation(data));
      });
      socket.on("receiveDeleteConversation", (data: Conversation) => {
        if (id == data._id) {
          navigate("/conversations");
        }
        //@ts-ignore
        dispatch(deleteConversation(data));
      });

      socket.on("receiveUpdatedConversation", (data: Conversation) => {
        //@ts-ignore
        dispatch(updateConversations(data));
        //@ts-ignore
        dispatch(updateConversation(data));
      });
    }
  }, []);

  const handleOpenCreateBox = () => {
    setOpenCreateBox(true);
  };
  const handleOpenCreateGroupBox = () => {
    setOpenCreateGroupBox(true);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
      dispatch(ApiSlice.util.resetApiState());
      navigate("/login");
    } catch {}
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
                <IconButton onClick={handleOpenCreateBox}>
                  <PersonAdd />
                </IconButton>

                <IconButton
                  onClick={handleOpenCreateGroupBox}
                  sx={{ ml: "10px" }}
                >
                  <GroupAddIcon />
                </IconButton>
                <IconButton onClick={handleMenuClick}>
                  <UserAvatar
                    user={user}
                    height={40}
                    width={40}
                    sx={{ curosr: "pointer", ml: "10px" }}
                  />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                  <MenuItem onClick={() => {navigate("/conversations/profile")}}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            {isLoading ? (
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
            ) : conversations.length ? (
              conversations.map((con: Conversation) => (
                <ConversationCard key={con._id} conversation={con} />
              ))
            ) : (
              <NoData text="Chat with your friend..." />
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
            overflowY: "scroll",
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
      <CreateConversation
        socket={socket}
        setOpen={setOpenCreateBox}
        open={openCreateBox}
      />
      <CreateConversationGroup
        socket={socket}
        setOpen={setOpenCreateGroupBox}
        open={openCreateGroupBox}
      />
    </>
  );
};
