import { useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Modal from "react-modal";
import Routes from "./routes";

import GlobalStyle from "./styles/global";
import { Dashboard } from "./pages/Dashboard";

Modal.setAppElement("#root");

export function App ()  {
  return (
    <BrowserRouter>
      <Routes />
      <Dashboard/>
      <GlobalStyle />
    </BrowserRouter>
  )
};

