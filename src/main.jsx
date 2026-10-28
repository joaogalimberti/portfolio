import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./i18n";

// Cursor glow spotlight — desktop/pointer devices only
const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth <= 768;

if (!isTouch) {
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let tx = cx;
  let ty = cy;

  document.addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  const lerp = (a, b, t) => a + (b - a) * t;

  const animGlow = () => {
    cx = lerp(cx, tx, 0.1);
    cy = lerp(cy, ty, 0.1);
    glow.style.left = `${cx}px`;
    glow.style.top  = `${cy}px`;
    requestAnimationFrame(animGlow);
  };
  animGlow();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
