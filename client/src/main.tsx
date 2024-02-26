import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const THEME = createTheme({
  typography: {
    fontFamily: `"Lato", "Helvetica", "Arial", sans-serif`,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        style: { padding: "10px" },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={process.env.REACT_GG_CLIENT_ID || ""}>
    <Provider store={store}>
      <ThemeProvider theme={THEME}>
        <App />
      </ThemeProvider>
    </Provider>
  </GoogleOAuthProvider>
);
