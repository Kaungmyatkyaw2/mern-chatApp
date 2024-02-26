import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../../store/slices/api/endpoints/auth.endpoints";
import { Box, LinearProgress } from "@mui/material";
import { useEffect } from "react";

export const NavigateHome = () => {
  const { isFetching, isSuccess, refetch } = useGetMeQuery();

  useEffect(() => {
    refetch();
  }, []);

  if (isFetching) {
    return (
      <Box>
        <LinearProgress />
        <Outlet />
      </Box>
    );
  }

  if (!isFetching && isSuccess) {
    return <Navigate to={"/conversations"} />;
  }

  return <Outlet />;
};
