import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/Store.js";
import { LoginPopupProvider } from "./context/LoginPopupContext.jsx";

createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <LoginPopupProvider>
        
          <App />
       
      </LoginPopupProvider>
    </Provider>
  // </React.StrictMode>
);
