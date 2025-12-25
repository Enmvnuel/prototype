"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import EmployeeDashboard from "@/components/employee-dashboard"
import RequestFormPage from "@/components/request-form-page"
import ManagerPanel from "@/components/manager-panel"
import { AppProvider } from "@/context/app-context"
import { Loader2 } from "lucide-react"

type UserRole = "employee" | "manager" | null
type EmployeeView = "dashboard" | "request-form"
type ManagerView = "panel" | "review-modal"

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)
  const [employeeView, setEmployeeView] = useState<EmployeeView>("dashboard")
  const [managerView, setManagerView] = useState<ManagerView>("panel")

  useEffect(() => {
    // Check for saved session
    const savedRole = localStorage.getItem("elm-user-role") as UserRole
    if (savedRole) {
      setUserRole(savedRole)
    }
    setLoading(false)
  }, [])

  const handleLogin = (role: "employee" | "manager") => {
    setUserRole(role)
    localStorage.setItem("elm-user-role", role)
  }

  const handleLogout = () => {
    setUserRole(null)
    setEmployeeView("dashboard")
    setManagerView("panel")
    localStorage.removeItem("elm-user-role")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        {userRole === "employee" && (
          <>
            {employeeView === "dashboard" && (
              <EmployeeDashboard onCreateRequest={() => setEmployeeView("request-form")} onLogout={handleLogout} />
            )}
            {employeeView === "request-form" && (
              <RequestFormPage onBack={() => setEmployeeView("dashboard")} onLogout={handleLogout} />
            )}
          </>
        )}

        {userRole === "manager" && (
          <ManagerPanel onLogout={handleLogout} currentView={managerView} onViewChange={setManagerView} />
        )}
      </div>
    </AppProvider>
  )
}
