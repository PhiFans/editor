import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BlueprintProvider } from '@blueprintjs/core'
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlueprintProvider>
      <App />
    </BlueprintProvider>
  </StrictMode>,
)
