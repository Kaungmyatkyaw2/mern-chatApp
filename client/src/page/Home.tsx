// Import necessary Material-UI components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import img from "/mock.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const toLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="gridBackground">
        <div className="gradient"></div>
      </div>{" "}
      <AppBar position="static" sx={{ bgcolor: "white" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: "black", fontWeight: "bold" }}>
            ChatApp
          </Typography>
          <Box sx={{ ml: "auto" }}>
            <Button onClick={toLogin}>Start Now</Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid
          container
          spacing={3}
          style={{ marginTop: "20px" }}
          alignItems={"center"}
        >
          <Grid item md={6} xs={12}>
            <Typography
              variant="h4"
              sx={{ color: "black", fontWeight: "bold" }}
            >
              Chat App With MERN Stack
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "gray", mt: "15px" }}>
              Explore a revolutionary chat experience with our MERn
              stack-powered app, leveraging advanced WebSocket technology. From
              staying connected with friends to seamless collaboration, our app
              offers a responsive platform for all your messaging needs.
              Download now to redefine your communication with innovation and
              user-friendly design. Connect effortlessly and elevate your
              conversations!
            </Typography>
            <Box sx={{ mt: "25px" }}>
              <Button onClick={toLogin} variant="outlined">
                Start Using Now
              </Button>
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Grid container justifyContent={"center"}>
              <img
                src={img}
                width={250}
                style={{ rotate: "20deg", margin: "0 auto" }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Box mt={5}>
        <Typography variant="body2" color="textSecondary" align="center">
          Your Website &copy; {new Date().getFullYear()}
        </Typography>
      </Box>
    </div>
  );
};

export { Home };
