import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateMeMutation } from "../../store/slices/api/endpoints/auth.endpoints";
import { getUser, updateUser } from "../../store/slices/auth.slice";
import UserAvatar from "../conversation/UserAvatar";
import ErrorSnackbar from "../others/ErrorSnackbar";

export const UpdateInfo = () => {
  const me = useSelector(getUser);
  const [name, setName] = useState(me?.name || "");
  const [showError, setShowError] = useState(false);
  const [updateMe, updateMeRes] = useUpdateMeMutation();
  const dispatch = useDispatch();

  const handleUpdateMe = async () => {
    try {
      if (name) {
        const res = await updateMe({ name }).unwrap();
        dispatch(updateUser(res.data));
      }
    } catch (error) {
      setShowError(true);
    }
  };
  return (
    <Box width={"100%"}>
      <ErrorSnackbar
        show={showError}
        setShow={setShowError}
        msg={
          (updateMeRes.error as { data: { message: string } })?.data?.message
        }
      />
      <Typography variant="h5" fontWeight={"bold"}>
        My Profile
      </Typography>
      <Box sx={{ mt: "20px" }}>
        <UserAvatar user={me} width={70} height={70} />
      </Box>
      <TextField
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mt: "20px" }}
        fullWidth
        size="small"
        label="Name"
        variant="filled"
      />
      <LoadingButton
        loading={updateMeRes.isLoading}
        onClick={handleUpdateMe}
        variant="contained"
        sx={{ width: "100px", mt: "20px" }}
      >
        Save
      </LoadingButton>
    </Box>
  );
};
