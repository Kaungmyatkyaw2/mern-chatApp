import { Explore } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const NoData = ({ text }: { text: string }) => {
  return (
    <Box
      sx={{
        height: "80%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Explore sx={{ width: "100px", height: "100px", color: "gray" }} />
      <Typography color="gray" variant="subtitle1">{text}</Typography>
    </Box>
  );
};

export default NoData;
