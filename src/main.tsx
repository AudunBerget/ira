import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@digdir/designsystemet-css";
import "@digdir/designsystemet-css/theme";
import App from './App.tsx'
import './style/styles.css'
import './style/songs.css'
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
