import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth/Auth";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import { SocketProvider } from "./context/SocketContex";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                    element={
                        <SocketProvider>
                            <ProtectedRoutes />
                        </SocketProvider>
                    }
                >
                    <Route path="/" element={<Chat />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>
                <Route />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
