import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../../store/slices/api/endpoints/auth.endpoints";
import LoadingScreen from "../others/LoadingScreen";

export const ProtectRoute = () => {
  const { isLoading, isError } = useGetMeQuery();

  if (isLoading) {
    return (
      <LoadingScreen>
        <Outlet />
      </LoadingScreen>
    );
  }

  if (isError) {
    return <Navigate to={"/login"} />;
  }

  return <Outlet />;
};
