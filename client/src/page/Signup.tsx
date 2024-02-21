import {
  Alert,
  Button,
  FormControl,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import { Google } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { emailPattern, passwordLength, setRequired } from "../validation";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../store/slices/api/endpoints/auth.endpoints";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setAuth } from "../store/slices/auth.slice";
import LoadingButton from "@mui/lab/LoadingButton";

interface FormValue {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

export const Signup = () => {
  const form = useForm<FormValue>();
  const { formState, handleSubmit, register } = form;
  const { isValid, errors } = formState;
  const [signup, { error, isLoading }] = useSignupMutation();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values: FormValue) => {
    try {
      const res = await signup(values).unwrap();
      dispatch(setAuth({ access_token: res.token, user: res.data }));
      navigate("/conversations");
    } catch (error) {
      setShowSnackBar(true);
    }
  };

  const handleSnackBarClose = (
    _?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackBar(false);
  };

  return (
    <>
      <div className="gridBackground">
        <div className="gradient"></div>
      </div>
      <Grid
        container
        height={"100vh"}
        alignContent={"center"}
        justifyContent={"center"}
      >
        <Snackbar
          anchorOrigin={{ horizontal: "center", vertical: "top" }}
          open={showSnackBar}
          autoHideDuration={5000}
          onClose={handleSnackBarClose}
        >
          <Alert
            onClose={handleSnackBarClose}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {(error as { data: { message: string } })?.data?.message}
          </Alert>
        </Snackbar>
        <Paper
          sx={{ width: 350, p: "15px", borderRadius: "10px", bgcolor: "white" }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", pb: "5px" }}>
            Sign up
          </Typography>
          <Typography variant="subtitle2">
            Already have an account? <Link to={"/login"}>Log in</Link>
          </Typography>
          <FormControl sx={{ width: "100%", pt: "20px", gap: "20px" }}>
            <TextField
              helperText={errors ? errors.email?.message : null}
              size="small"
              error={!!errors.email}
              label="Email"
              variant="filled"
              {...register("email", {
                required: setRequired("Email is required"),
                pattern: emailPattern,
              })}
            />
            <TextField
              helperText={errors ? errors.name?.message : null}
              size="small"
              error={!!errors.name}
              label="Name"
              variant="filled"
              {...register("name", {
                required: setRequired("Name is required"),
              })}
            />
            <TextField
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
              helperText={errors ? errors.passwordConfirm?.message : null}
              size="small"
              error={!!errors.passwordConfirm}
              label="Confirm Password"
              variant="filled"
              {...register("passwordConfirm", {
                required: setRequired("Confirm password is required"),
                minLength: passwordLength,
              })}
            />
            <LoadingButton
              loading={isLoading}
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
            >
              Signup
            </LoadingButton>
          </FormControl>
          <Typography
            variant="subtitle2"
            color={"GrayText"}
            sx={{ textAlign: "center", py: "20px" }}
          >
            Or Continue With
          </Typography>
          <Button
            variant="outlined"
            sx={{ width: "100%" }}
            startIcon={<Google />}
            color="success"
          >
            GOOGLE
          </Button>
        </Paper>
      </Grid>
    </>
  );
};
