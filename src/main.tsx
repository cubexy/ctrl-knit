import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/layout/Home.tsx";
import Wrapper from "./components/layout/Wrapper.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Wrapper>
      <App />
    </Wrapper>
  </StrictMode>
);
