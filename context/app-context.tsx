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
const generateMockRequests = (): RequestData[] => {
  const requests: RequestData[] = []

  // 1. Employee Requests (Current User - emp001)
  // Requirement: Max 10 requests, changing year every 2 requests (2020-2025)
  const employeeId = "emp001"
  const employeeName = "Empleado Actual"
  const types = ["Vacaciones", "Licencia por Enfermedad", "Compensatorio"] as const
  const statuses = ["APROBADO", "RECHAZADO", "PENDIENTE"] as const

  let currentYear = 2020

  for (let i = 0; i < 10; i++) {
    // Change year every 2 requests
    if (i > 0 && i % 2 === 0) {
      if (currentYear < 2025) currentYear++
    }

    const month = Math.floor(Math.random() * 12) + 1
    const day = Math.floor(Math.random() * 20) + 1
    const dateStr = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    const endDateStr = `${currentYear}-${month.toString().padStart(2, '0')}-${(day + 3).toString().padStart(2, '0')}`

    // NEW ID FORMAT: REQ001, REQ002...
    const idSuffix = (i + 1).toString().padStart(3, '0')
    const reqId = `REQ${idSuffix}`

    requests.push({
      id: reqId,
      employeeId,
      employeeName,
      type: types[i % 3], // Rotate types
      startDate: dateStr,
      endDate: endDateStr,
      totalDays: 3,
      workSite: "Sede Central",
      status: i === 9 ? "PENDIENTE" : statuses[i % 3], // Ensure at least one pending, rotate others
      createdAt: dateStr,
      observations: `Solicitud generada para el año ${currentYear}`,
      evidence: i % 2 === 0, // Alternate evidence
    })
  }

  // 2. Manager Requests (Other Employees)
  // Requirement: Many requests, distinct names, realistic simulation
  const firstNames = ["Juan", "María", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Sofia", "Miguel", "Lucía"]
  const lastNames = ["Pérez", "García", "López", "Martínez", "Rodríguez", "González", "Sánchez", "Ramírez", "Torres", "Flores"]
  const areas = ["Logística", "Operaciones", "RRHH", "Finanzas", "TI", "Ventas"]

  for (let i = 0; i < 50; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const area = areas[Math.floor(Math.random() * areas.length)]

    // Most should be pending for the manager to act on
    const status = Math.random() > 0.7 ? (Math.random() > 0.5 ? "APROBADO" : "RECHAZADO") : "PENDIENTE"

    const month = Math.floor(Math.random() * 3) + 10 // Oct-Dec 2025
    const day = Math.floor(Math.random() * 28) + 1
    const dateStr = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

    // NEW ID FORMAT FOR MANAGER: REQ101...
    const idSuffix = (101 + i).toString().padStart(3, '0')
    const reqId = `REQ${idSuffix}`

    requests.push({
      id: reqId,
      employeeId: `emp-${100 + i}`,
      employeeName: `${fName} ${lName}`,
      type: types[Math.floor(Math.random() * types.length)],
      startDate: dateStr,
      endDate: `2025-${month.toString().padStart(2, '0')}-${(day + 2).toString().padStart(2, '0')}`,
      totalDays: Math.floor(Math.random() * 5) + 1,
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
    const saved = localStorage.getItem("elm-requests-v1")
    if (saved) {
      try {
        setRequests(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse requests", e)
        setRequests(generateMockRequests())
      }
    } else {
      setRequests(generateMockRequests())
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever requests change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("elm-requests-v1", JSON.stringify(requests))
    }
  }, [requests, isInitialized])

  const addRequest = (request: RequestData) => {
    setRequests(prev => [request, ...prev])
  }

  const updateRequest = (id: string, updates: Partial<RequestData>) => {
    setRequests(prev => prev.map((req) => (req.id === id ? { ...req, ...updates } : req)))
  }

  const getEmployeeBalance = (employeeId: string) => {
    // Fixed mock balance for the simulation
    return { vacation: 15, compensatory: 4 }
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
