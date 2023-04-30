import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastProvider } from "react-toast-notifications";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
