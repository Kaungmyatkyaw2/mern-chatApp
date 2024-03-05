import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import React from "react";
import { User } from "../../types/user.types";
import UserAvatar from "../conversation/UserAvatar";
import getAvatar from "../../utils/getAvatar";

let avatar = [
  "misty",
  "abby",
  "cleo",
  "max",
  "mistkitty",
  "bubba",
  "mia",
  "kitty",
  "nala",
  "gizmo",
  "mittens",
  "trouble",
  "smokey",
  "zoe",
  "muffin",
  "callie",
  "daisy",
  "salem",
  "mimi",
  "oscar",
];

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    sm: 400,
    xs: 300,
  },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  height: "70vh",
  overflowY: "scroll",
};

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurImg: React.Dispatch<React.SetStateAction<string>>;
  user: User;
}

const AvatarModal = ({ setOpen, open, user, setCurImg }: Props) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box sx={style}>
        <Typography
          variant="h6"
          fontWeight={"bold"}
          textAlign={"center"}
          pb="20px"
        >
          Select your avatar
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: "20px",
          }}
        >
          <Box sx={{ borderRadius: "100%" }}>
            <UserAvatar user={user} width={70} height={70} />
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
            mt: "20px",
          }}
        >
          {avatar.map((el) => (
            <Button
              key={el}
              variant="text"
              onClick={() => {
                setCurImg(getAvatar(el));
              }}
              sx={{
                borderRadius: "100%",
                border: user.picture == getAvatar(el) ? "1px solid blue" : "",
              }}
            >
              <UserAvatar
                user={{
                  ...user,
                  picture: getAvatar(el),
                }}
                width={70}
                height={70}
              />
            </Button>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default AvatarModal;
