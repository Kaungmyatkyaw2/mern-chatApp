import { Chat } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

export const ChatHome = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection : "column"
      }}
    >
      <Chat sx={{width : "50px",height : "50px",color : "gray"}}/>
      <Typography variant="h6" color="gray">Start chat now!</Typography>
    </Box>
  );
};
