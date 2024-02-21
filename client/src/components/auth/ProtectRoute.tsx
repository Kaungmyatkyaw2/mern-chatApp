import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../../store/slices/api/endpoints/auth.endpoints";
import { Box, LinearProgress } from "@mui/material";

export const ProtectRoute = () => {
  const { isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    return (
      <Box>
        <LinearProgress />
        <Outlet />
      </Box>
    );
  }

  if (isError) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};
