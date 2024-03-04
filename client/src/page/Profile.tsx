import { Box, Divider, IconButton } from "@mui/material";
import { UpdateInfo, UpdatePassword } from "../components/profile";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";

export const Profile = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        p: { md: "50px", xs: "20px" },
      }}
    >
      <IconButton
        sx={{ mb: "20px" }}
        onClick={() => {
          navigate("/conversations");
        }}
      >
        <ArrowBack />
      </IconButton>
      <UpdateInfo />
      <Box py="50px">
        <Divider />
      </Box>
      <UpdatePassword />
    </Box>
  );
};
