import { LoadingButton } from "@mui/lab";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateMeMutation } from "../../store/slices/api/endpoints/auth.endpoints";
import { getUser, updateUser } from "../../store/slices/auth.slice";
import UserAvatar from "../conversation/UserAvatar";
import ErrorSnackbar from "../others/ErrorSnackbar";
import AvatarModal from "./AvatarModal";
import { User } from "../../types/user.types";
import getAvatar from "../../utils/getAvatar";
import { Refresh } from "@mui/icons-material";

export const UpdateInfo = () => {
  const me = useSelector(getUser);
  const [name, setName] = useState(me?.name || "");
  const [image, setImage] = useState(me?.picture || getAvatar(me?.name));
  const [openAvatarSelectBox, setOpenAvatarSelectBox] = useState(false);
  const [showError, setShowError] = useState(false);
  const [updateMe, updateMeRes] = useUpdateMeMutation();
  const dispatch = useDispatch();

  const resetInfo = () => {
    setName(me?.name || "");
    setImage(me?.picture || getAvatar(me?.name));
  };

  const handleUpdateMe = async () => {
    try {
      if (name) {
        const res = await updateMe({ name, picture: image }).unwrap();
        dispatch(updateUser(res.data));
      }
    } catch (error) {
      setShowError(true);
      resetInfo();
    }
  };
  return (
    <Box width={"100%"}>
      <AvatarModal
        open={openAvatarSelectBox}
        setOpen={setOpenAvatarSelectBox}
        setCurImg={setImage}
        user={{ ...me, picture: image } as User}
      />
      <ErrorSnackbar
        show={showError}
        setShow={setShowError}
        msg={
          (updateMeRes.error as { data: { message: string } })?.data?.message
        }
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" fontWeight={"bold"}>
          My Profile
        </Typography>
        <IconButton onClick={resetInfo}>
          <Refresh />
        </IconButton>
      </Box>
      <IconButton
        sx={{ mt: "20px" }}
        onClick={() => {
          setOpenAvatarSelectBox(true);
        }}
      >
        <UserAvatar
          user={{ ...me, picture: image } as User}
          width={70}
          height={70}
        />
      </IconButton>
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
