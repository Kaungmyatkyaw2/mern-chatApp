import { Box, LinearProgress } from "@mui/material";
import { HTMLProps } from "react";

const LoadingScreen = ({ children }: HTMLProps<HTMLDivElement>) => {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "whitesmoke",
          opacity: 0.5,
          position: "fixed",
          minHeight: "100vh",
          minWidth: "100%",
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      ></Box>
      <LinearProgress />
      {children}
    </Box>
  );
};

export default LoadingScreen;
