import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ToastProvider } from "@/lib/toast-context"
import { Landing } from "@/pages/Landing"
import { Dashboard } from "@/pages/Dashboard"
import { Analytics } from "@/pages/Analytics"
import { Settings } from "@/pages/Settings"
import { Journal } from "@/pages/Journal"
import { Onboarding } from "@/pages/Onboarding"
import { Signup } from "@/pages/Signup"
import { GridTest } from "@/pages/GridTest"





function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/onboarding" element={<Onboarding />} />
          {/* Placeholder Login - redirect to dashboard for now until auth is set up */}
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup/*" element={<Signup />} />
          <Route path="/grid-test" element={<GridTest />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
