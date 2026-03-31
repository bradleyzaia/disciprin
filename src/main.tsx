import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConvexClientProvider } from './ConvexClientProvider.tsx'
import { StaggerProvider } from "@/components/ui/stagger-context"

// Global error handler for debugging in Tauri
window.addEventListener('error', (e) => {
  document.body.innerHTML = `<pre style="color:red;padding:20px;font-size:14px;">ERROR: ${e.message}\n\n${e.filename}:${e.lineno}\n\n${e.error?.stack || ''}</pre>`;
});
window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML = `<pre style="color:red;padding:20px;font-size:14px;">UNHANDLED PROMISE: ${e.reason?.message || e.reason}\n\n${e.reason?.stack || ''}</pre>`;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexClientProvider>
      <StaggerProvider>
        <App />
      </StaggerProvider>
    </ConvexClientProvider>
  </StrictMode>,
)
