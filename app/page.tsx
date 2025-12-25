"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import EmployeeDashboard from "@/components/employee-dashboard"
import RequestFormPage from "@/components/request-form-page"
import ManagerPanel from "@/components/manager-panel"
import { AppProvider } from "@/context/app-context"

type UserRole = "employee" | "manager" | null
type EmployeeView = "dashboard" | "request-form"
type ManagerView = "panel" | "review-modal"

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [employeeView, setEmployeeView] = useState<EmployeeView>("dashboard")
  const [managerView, setManagerView] = useState<ManagerView>("panel")

  const handleLogin = (role: "employee" | "manager") => {
    setUserRole(role)
  }

  const handleLogout = () => {
    setUserRole(null)
    setEmployeeView("dashboard")
    setManagerView("panel")
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
