import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Chat, ChatHome, Conversations, Home, Login, Signup } from "./page";
import { NavigateHome, ProtectRoute } from "./components/auth";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<ProtectRoute />}>
          <Route path="/conversations" element={<Conversations />}>
            <Route index element={<ChatHome />} />
            <Route path=":id" element={<Chat />} />
          </Route>
        </Route>
        <Route element={<NavigateHome />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
