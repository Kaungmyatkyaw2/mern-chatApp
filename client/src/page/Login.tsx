import { FormControl, Grid, Paper, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { emailPattern, passwordLength, setRequired } from "../validation";
import { Link, useNavigate } from "react-router-dom";
import {
  useGoogleAuthMutation,
  useLoginMutation,
} from "../store/slices/api/endpoints/auth.endpoints";
import { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/auth.slice";
import ErrorSnackbar from "../components/others/ErrorSnackbar";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Google } from "@mui/icons-material";

interface FormValue {
  email: string;
  password: string;
}

export const Login = () => {
  const [ggToken, setGgToken] = useState("");
  const form = useForm<FormValue>();
  const { formState, handleSubmit, register } = form;
  const { isValid, errors } = formState;
  const [login, loginAuthMutation] = useLoginMutation();
  const [googleAuth, googleAuthMutation] = useGoogleAuthMutation();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [errorMsg, setErrorMsg] = useState("Something went wrong");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errorMessage = () => {};

  const ggLogin = useGoogleLogin({
    onSuccess: (res) => {
      setGgToken(res.access_token);
    },
    onError: errorMessage,
  });

  const googleLogin = async (token: string) => {
    try {
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const body = {
        name: data.name,
        email: data.email,
        picture: data.picture,
      };

      const loginRes = await googleAuth(body).unwrap();
      dispatch(setAuth({ access_token: loginRes.token, user: loginRes.data }));
      navigate("/conversations");
    } catch (error) {
      setShowSnackBar(true);
      setErrorMsg(
        (error as { data: { message: string } })?.data?.message ||
          "Something went wrong"
      );
    }
  };

  useEffect(() => {
    if (ggToken) {
      googleLogin(ggToken);
    }
  }, [ggToken]);

  const onSubmit = async (values: FormValue) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setAuth({ access_token: res.token, user: res.data }));
      navigate("/conversations");
    } catch (error) {
      setShowSnackBar(true);
      setErrorMsg((error as { data: { message: string } })?.data?.message);
    }
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
        <ErrorSnackbar
          show={showSnackBar}
          setShow={setShowSnackBar}
          msg={errorMsg}
        />

        <Paper
          sx={{ width: 350, p: "15px", borderRadius: "10px", bgcolor: "white" }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", pb: "5px" }}>
            Login
          </Typography>
          <Typography variant="subtitle2">
            Don't have an account? <Link to={"/signup"}>Sign up</Link>
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
            <LoadingButton
              variant="contained"
              sx={{ py: "10px" }}
              loading={loginAuthMutation.isLoading}
              onClick={handleSubmit(onSubmit)}
              type="submit"
              disabled={!isValid}
            >
              Login
            </LoadingButton>
          </FormControl>
          <Typography
            variant="subtitle2"
            color={"GrayText"}
            sx={{ textAlign: "center", py: "20px" }}
          >
            Or Continue with
          </Typography>
          <LoadingButton
            variant="outlined"
            sx={{ width: "100%" }}
            startIcon={<Google />}
            color="success"
            disabled={
              loginAuthMutation.isLoading || googleAuthMutation.isLoading
            }
            loading={googleAuthMutation.isLoading}
            onClick={() => {
              ggLogin();
            }}
          >
            GOOGLE
          </LoadingButton>
        </Paper>
      </Grid>
    </>
  );
};
