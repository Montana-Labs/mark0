import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global CSS reset - applied programmatically to keep zero CSS files
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; padding: 0; }
  img { display: block; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
