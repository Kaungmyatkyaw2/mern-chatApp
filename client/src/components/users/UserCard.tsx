import { Box, Button, Typography } from "@mui/material";
import UserAvatar from "../conversation/UserAvatar";
import { User } from "../../types/user.types";

interface Props {
  user: User;
  onClick?: any;
  customText?: string;
  disabled?: Boolean;
}

export const UserCard = ({ user, onClick, customText, disabled }: Props) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <UserAvatar user={user} />
          <Typography variant="subtitle1">{user.name}</Typography>
        </Box>
        <Button disabled={!!disabled} onClick={onClick}>
          {customText}
        </Button>
      </Box>
    </>
  );
};
