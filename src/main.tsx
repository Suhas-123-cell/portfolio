import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/anton/latin-400.css'
import '@fontsource/bangers/latin-400.css'
import '@fontsource-variable/space-grotesk/wght.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
