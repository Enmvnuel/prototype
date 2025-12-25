"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export interface RequestData {
  id: string
  employeeId: string
  employeeName: string
  type: "Vacaciones" | "Licencia por Enfermedad" | "Compensatorio"
  startDate: string
  endDate: string
  totalDays: number
  workSite: string
  status: "PENDIENTE" | "APROBADO" | "RECHAZADO"
  createdAt: string
  observations: string
  evidence?: File
}

export interface ReviewData {
  selectedIds: string[]
  currentReviewId?: string
  managerNotes: string
  decision?: "approve" | "reject" | "return"
}

interface AppContextType {
  requests: RequestData[]
  addRequest: (request: RequestData) => void
  updateRequest: (id: string, updates: Partial<RequestData>) => void
  getEmployeeBalance: (employeeId: string) => { vacation: number; compensatory: number }
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Mock data with realistic employee request history
const MOCK_REQUESTS: RequestData[] = [
  {
    id: "REQ001",
    employeeId: "emp001",
    employeeName: "Nombre del Empleado",
    type: "Vacaciones",
    startDate: "2025-12-01",
    endDate: "2025-12-05",
    totalDays: 5,
    workSite: "Oficina Principal",
    status: "PENDIENTE",
    createdAt: "2025-11-15",
    observations: "",
  },
  {
    id: "REQ002",
    employeeId: "emp001",
    employeeName: "Nombre del Empleado",
    type: "Licencia por Enfermedad",
    startDate: "2025-10-25",
    endDate: "2025-10-26",
    totalDays: 2,
    workSite: "Remoto",
    status: "APROBADO",
    createdAt: "2025-10-20",
    observations: "",
  },
  {
    id: "REQ003",
    employeeId: "emp001",
    employeeName: "Nombre del Empleado",
    type: "Vacaciones",
    startDate: "2025-09-10",
    endDate: "2025-09-15",
    totalDays: 5,
    workSite: "Sucursal A",
    status: "RECHAZADO",
    createdAt: "2025-09-01",
    observations: "",
  },
  {
    id: "REQ004",
    employeeId: "emp001",
    employeeName: "Nombre del Empleado",
    type: "Compensatorio",
    startDate: "2025-08-10",
    endDate: "2025-08-10",
    totalDays: 1,
    workSite: "Oficina Principal",
    status: "APROBADO",
    createdAt: "2025-08-05",
    observations: "",
  },
]

const MANAGER_REQUESTS: RequestData[] = [
  {
    id: "REQ001",
    employeeId: "emp001",
    employeeName: "Nombre del Empleado 1",
    type: "Vacaciones",
    startDate: "2025-12-01",
    endDate: "2025-12-05",
    totalDays: 5,
    workSite: "Logística",
    status: "PENDIENTE",
    createdAt: "2025-11-15",
    observations: "",
  },
  {
    id: "REQ002",
    employeeId: "emp002",
    employeeName: "Nombre del Empleado 2",
    type: "Licencia por Enfermedad",
    startDate: "2025-11-20",
    endDate: "2025-11-22",
    totalDays: 3,
    workSite: "Operaciones",
    status: "PENDIENTE",
    createdAt: "2025-11-15",
    observations: "",
  },
  {
    id: "REQ003",
    employeeId: "emp003",
    employeeName: "Nombre del Empleado 3",
    type: "Vacaciones",
    startDate: "2025-10-10",
    endDate: "2025-10-10",
    totalDays: 1,
    workSite: "RRHH",
    status: "PENDIENTE",
    createdAt: "2025-10-01",
    observations: "",
  },
]

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<RequestData[]>(MOCK_REQUESTS)

  const addRequest = (request: RequestData) => {
    setRequests([...requests, request])
  }

  const updateRequest = (id: string, updates: Partial<RequestData>) => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, ...updates } : req)))
  }

  const getEmployeeBalance = (employeeId: string) => {
    // Mock calculation: employee starts with 12 vacation days and 3 compensatory days
    // This would be calculated based on actual requests in a real system
    return { vacation: 12, compensatory: 3 }
  }

  return (
    <AppContext.Provider value={{ requests, addRequest, updateRequest, getEmployeeBalance }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
