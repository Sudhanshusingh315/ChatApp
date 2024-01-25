import "./App.css";
import { Route } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";

function App() {
  return (
    <>
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chats} />
    </>
  );
}

export default App;
