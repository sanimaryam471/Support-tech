import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import WindowsLockSim from './componenets/WindowsLockSim'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WindowsLockSim />
  </StrictMode>,
)
