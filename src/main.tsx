(function () {
  const p = window.location.search.match(/[?&]p=([^&]*)/);
  if (p) {
    const decoded = decodeURIComponent(p[1]);
    window.history.replaceState(null, null, "/bibliocodes" + decoded);
  }
})();

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
