import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../../store/slices/api/endpoints/auth.endpoints";
import { useEffect } from "react";
import LoadingScreen from "../others/LoadingScreen";

export const NavigateHome = () => {
  const { isFetching, isSuccess, refetch } = useGetMeQuery();

  useEffect(() => {
    refetch();
  }, []);

  if (isFetching) {
    return (
      <LoadingScreen>
        <Outlet />
      </LoadingScreen>
    );
  }

  if (!isFetching && isSuccess) {
    return <Navigate to={"/conversations"} />;
  }

  return <Outlet />;
};
