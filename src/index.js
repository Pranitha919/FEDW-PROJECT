import './styles.css';
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // this automatically loads App.jsx

const root = createRoot(document.getElementById("root"));
root.render(<App />);
