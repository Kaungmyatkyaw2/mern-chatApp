import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useUpdateMyPasswordMutation } from "../../store/slices/api/endpoints/auth.endpoints";
import { setAuth } from "../../store/slices/auth.slice";
import ErrorSnackbar from "../others/ErrorSnackbar";
import { useForm } from "react-hook-form";
import { passwordLength, setRequired } from "../../validation";

interface FormValue {
  oldPassword: string;
  password: string;
  passwordConfirm: string;
}

export const UpdatePassword = () => {
  const [showError, setShowError] = useState(false);
  const [updateMyPassword, updateMyPasswordRes] = useUpdateMyPasswordMutation();
  const dispatch = useDispatch();

  const form = useForm<FormValue>();
  const { formState, handleSubmit, register } = form;
  const { isValid, errors } = formState;

  const handleChangePassword = async (values: FormValue) => {
    try {
      const res = await updateMyPassword(values).unwrap();
      dispatch(setAuth({ access_token: res.token, user: res.data }));
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
          (updateMyPasswordRes.error as { data: { message: string } })?.data
            ?.message
        }
      />
      <Typography variant="h5" fontWeight={"bold"}>
        Update Your Password
      </Typography>

      <TextField
        sx={{ width: "100%", mt: "20px" }}
        helperText={errors ? errors.oldPassword?.message : null}
        size="small"
        error={!!errors.oldPassword}
        label="Old Password"
        variant="filled"
        {...register("oldPassword", {
          required: setRequired("Old Password is required"),
          minLength: passwordLength,
        })}
      />
      <TextField
        sx={{ width: "100%", mt: "20px" }}
        helperText={errors ? errors.password?.message : null}
        size="small"
        error={!!errors.password}
        label="Password"
        variant="filled"
        {...register("password", {
          required: setRequired("Password is required"),
          minLength: passwordLength,
        })}
      />
      <TextField
        sx={{ width: "100%", mt: "20px" }}
        helperText={errors ? errors.passwordConfirm?.message : null}
        size="small"
        error={!!errors.passwordConfirm}
        label="Confirm Password"
        variant="filled"
        {...register("passwordConfirm", {
          required: setRequired("Confirm Password is required"),
          minLength: passwordLength,
        })}
      />
      <LoadingButton
        loading={updateMyPasswordRes.isLoading}
        onClick={handleSubmit(handleChangePassword)}
        variant="contained"
        sx={{ width: "100px", mt: "20px" }}
        disabled={!isValid}
      >
        Save
      </LoadingButton>
    </Box>
  );
};
