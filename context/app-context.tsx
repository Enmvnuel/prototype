"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface RequestData {
  id: string
  employeeId: string
  employeeName: string
  type: "Vacaciones" | "Licencia por Enfermedad" | "Compensatorio" | "Permiso Personal"
  startDate: string
  endDate: string
  totalDays: number
  workSite: string
  status: "PENDIENTE" | "APROBADO" | "RECHAZADO"
  createdAt: string
  observations: string
  managerNotes?: string
  reviewedAt?: string
  evidence?: boolean // Changed to boolean for simulation: true = has evidence
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

// Helper to generate mock requests
// Helper to generate mock requests
const generateMockRequests = (): RequestData[] => {
  const requests: RequestData[] = []

  // Helper to add days to a date string and return YYYY-MM-DD
  const addDays = (dateStr: string, days: number): string => {
    const date = new Date(dateStr)
    // Add days (days - 1 because inclusive: 1 day duration = same start/end)
    date.setDate(date.getDate() + (days - 1))
    return date.toISOString().split('T')[0]
  }

  // 1. Employee Requests (Current User - emp001)
  // Requirement: Max 10 requests, changing year every 2 requests (2020-2025)
  const employeeId = "emp001"
  const employeeName = "Empleado Actual"
  // Avoiding "Vacaciones" for emp001 mocks so they start with full 15 days balance as requested
  const types = ["Licencia por Enfermedad", "Compensatorio"] as const
  const statuses = ["APROBADO", "RECHAZADO", "PENDIENTE"] as const

  let currentYear = 2020

  for (let i = 0; i < 5; i++) { // Reduced count for clarity
    // Change year every 2 requests
    if (i > 0 && i % 2 === 0) {
      if (currentYear < 2025) currentYear++
    }

    // Generate random start date
    const month = Math.floor(Math.random() * 12) + 1
    const day = Math.floor(Math.random() * 20) + 1
    const dateStr = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

    // Determine random duration
    const duration = Math.floor(Math.random() * 3) + 1 // 1-3 days
    const endDateStr = addDays(dateStr, duration)

    // NEW ID FORMAT: REQ001, REQ002...
    const idSuffix = (i + 1).toString().padStart(3, '0')
    const reqId = `REQ${idSuffix}`

    requests.push({
      id: reqId,
      employeeId,
      employeeName,
      type: types[i % 2], // Only non-vacation types
      startDate: dateStr,
      endDate: endDateStr,
      totalDays: duration,
      workSite: "Sede Central",
      status: statuses[i % 3],
      createdAt: dateStr,
      observations: `Solicitud generada para el año ${currentYear}`,
      evidence: i % 2 === 0,
    })
  }

  // 2. Manager Requests (Other Employees)
  // Requirement: Many requests, distinct names, realistic simulation
  const firstNames = ["Juan", "María", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Sofia", "Miguel", "Lucía"]
  const lastNames = ["Pérez", "García", "López", "Martínez", "Rodríguez", "González", "Sánchez", "Ramírez", "Torres", "Flores"]
  const areas = ["Logística", "Operaciones", "RRHH", "Finanzas", "TI", "Ventas"]

  // Re-define types for manager requests to include Vacations
  const managerTypes = ["Vacaciones", "Licencia por Enfermedad", "Compensatorio"]

  for (let i = 0; i < 50; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const area = areas[Math.floor(Math.random() * areas.length)]

    // Most should be pending for the manager to act on
    const status = Math.random() > 0.7 ? (Math.random() > 0.5 ? "APROBADO" : "RECHAZADO") : "PENDIENTE"

    const month = Math.floor(Math.random() * 3) + 10 // Oct-Dec 2025
    const day = Math.floor(Math.random() * 25) + 1
    const dateStr = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

    const duration = Math.floor(Math.random() * 5) + 1 // 1-5 days
    const endDateStr = addDays(dateStr, duration)

    // NEW ID FORMAT FOR MANAGER: REQ101...
    const idSuffix = (101 + i).toString().padStart(3, '0')
    const reqId = `REQ${idSuffix}`

    requests.push({
      id: reqId,
      employeeId: `emp-${100 + i}`,
      employeeName: `${fName} ${lName}`,
      type: managerTypes[Math.floor(Math.random() * managerTypes.length)] as any,
      startDate: dateStr,
      endDate: endDateStr,
      totalDays: duration,
      workSite: area,
      status: status as any,
      createdAt: dateStr,
      observations: "Solicitud pendiente de revisión",
      evidence: Math.random() > 0.3, // 70% chance of having evidence
    })
  }

  return requests
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with lazy initializer to read from localStorage immediately if possible (client-side)
  // However, for SSR safety in Next.js, we usually start with MOCK and sync in useEffect.
  // Given "simulation" requirement, useEffect sync is fine.
  const [requests, setRequests] = useState<RequestData[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    // CLEANUP: Remove old v1 data to prevent conflicts
    // CLEANUP: Remove old data to prevent conflicts
    if (localStorage.getItem("elm-requests-v1")) localStorage.removeItem("elm-requests-v1")
    if (localStorage.getItem("elm-requests-v2")) {
      console.log("🧹 Cleaning up old data (v2)...")
      localStorage.removeItem("elm-requests-v2")
    }

    // UPDATED KEY TO V3 TO FORCE RESET FOR USER (Fix date logic)
    const saved = localStorage.getItem("elm-requests-v3")
    if (saved) {
      try {
        setRequests(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse requests", e)
        setRequests(generateMockRequests())
      }
    } else {
      console.log("🔄 Initializing with fresh mock data (v3 fixed dates)...")
      setRequests(generateMockRequests())
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever requests change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("elm-requests-v3", JSON.stringify(requests))
    }
  }, [requests, isInitialized])

  const addRequest = (request: RequestData) => {
    setRequests(prev => [request, ...prev])
  }

  const updateRequest = (id: string, updates: Partial<RequestData>) => {
    setRequests(prev => prev.map((req) => (req.id === id ? { ...req, ...updates } : req)))
  }

  const getEmployeeBalance = (employeeId: string) => {
    // Starting balances
    const baseVacation = 15
    const baseCompensatory = 4

    // Calculate approved deductions (and include PENDING to reserve days immediately)
    const deductions = requests
      .filter(req => req.employeeId === employeeId && (req.status === "APROBADO" || req.status === "PENDIENTE"))
      .reduce((acc, req) => {
        if (req.type === "Vacaciones") acc.vacation += req.totalDays
        if (req.type === "Compensatorio") acc.compensatory += req.totalDays
        return acc
      }, { vacation: 0, compensatory: 0 })

    return {
      vacation: Math.max(0, baseVacation - deductions.vacation),
      compensatory: Math.max(0, baseCompensatory - deductions.compensatory)
    }
  }

  // Prevent hydration mismatch by rendering children only after init or providing fallback
  // For this prototype, we'll render immediately but data might pop in.

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
