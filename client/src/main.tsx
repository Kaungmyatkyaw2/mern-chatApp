import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider, createTheme } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import "./index.css";

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
  <Provider store={store}>
    <ThemeProvider theme={THEME}>
      <App />
    </ThemeProvider>
  </Provider>
);
