import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./app/store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
// todo : Important -> all redux store and api should be error handled
createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App />
    </Provider>
);
