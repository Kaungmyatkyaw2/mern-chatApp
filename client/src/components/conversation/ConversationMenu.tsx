import { Delete, Logout, MoreHoriz } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { Conversation } from "../../types/conversations.types";
import { DeleteConversation } from "./DeleteConversation";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { getUser } from "../../store/slices/auth.slice";
import { LeaveConversation } from "./LeaveConversationDialog";

interface Props {
  conversation: Conversation | undefined;
  socket: Socket | undefined;
}

export const ConversationMenu = ({ conversation, socket }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [deletDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const admins = conversation?.admins;
  const me = useSelector(getUser);
  const isMeAdmin = admins?.some((el) => el == me?._id);

  const showDeleteBtn = conversation?.isGroup ? isMeAdmin : true;

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      <DeleteConversation
        socket={socket}
        open={deletDialogOpen}
        setOpen={setDeleteDialogOpen}
        conversation={conversation}
      />
      <LeaveConversation
        socket={socket}
        open={leaveDialogOpen}
        setOpen={setLeaveDialogOpen}
        conversation={conversation}
      />
      <IconButton onClick={handleMenuClick}>
        <MoreHoriz />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        {showDeleteBtn && (
          <MenuItem
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setLeaveDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Leave</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
