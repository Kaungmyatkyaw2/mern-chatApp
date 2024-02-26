import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../../store/slices/api/endpoints/auth.endpoints";
import { Box, LinearProgress } from "@mui/material";

export const NavigateHome = () => {
  const { isLoading, isSuccess } = useGetMeQuery();

  if (isLoading) {
    return (
      <Box>
        <LinearProgress />
        <Outlet />
      </Box>
    );
  }

  if (!isLoading && isSuccess) {
    return <Navigate to={"/conversations"} />;
  }

  return <Outlet />;
};
