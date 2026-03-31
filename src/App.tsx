import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastProvider } from "@/lib/toast-context"
import { Landing } from "@/pages/Landing"
import { Dashboard } from "@/pages/Dashboard"
import { Analytics } from "@/pages/Analytics"
import { Settings } from "@/pages/Settings"
import { Journal } from "@/pages/Journal"
import { Onboarding } from "@/pages/Onboarding"
import { Signup } from "@/pages/Signup"
import { Login } from "@/pages/Login"
import { GridTest } from "@/pages/GridTest"
import { Friends } from "@/pages/Friends"
import { EffectScene } from "@/components/effect-scene"
import { BackgroundController } from "@/components/layout/BackgroundController"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"




import { NativeTitlebar } from "@/components/layout/NativeTitlebar"
import { SmoothScroll } from "@/components/layout/SmoothScroll"
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react"
import { useEffect } from "react"
import { SFX, preloadSFX } from "@/lib/sfx"

function App() {
  useEffect(() => {
    preloadSFX(Object.values(SFX))
  }, [])

  return (
    <ToastProvider>
      <BrowserRouter>
        <NativeTitlebar />
        <SmoothScroll />
        <BackgroundController />
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/onboarding" element={<Onboarding />} />
          {/* Placeholder Login - redirect to dashboard for now until auth is set up */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup/*" element={<Signup />} />
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          <Route path="/grid-test" element={<GridTest />} />
          <Route path="/ascii" element={<EffectScene />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
