import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import TagManager from "react-gtm-module";
import { createApiFetch } from "./api";

TagManager.initialize({
    gtmId: "G-957G87MTC8",
});

const rootElement = document.getElementById("root");
if (rootElement) {
    const apiFetch = createApiFetch("https://hgwarmap.dphs.nl");
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App apiFetch={apiFetch} />
        </React.StrictMode>,
    );

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
} else console.error("Root element not found!");
