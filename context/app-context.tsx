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

  // Realistic and varied reasons - Expanded for uniqueness
  const sickReasons = [
    "Cita médica general y chequeo anual completo",
    "Gripe severa con fiebre alta y malestar general",
    "Infección estomacal viral diagnosticada por médico",
    "Cita con dentista por urgencia en muela del juicio",
    "Dolor lumbar agudo tras cargar cajas pesadas en almacén",
    "Migraña intensa con prescripción de reposo absoluto",
    "Pruebas de laboratorio en ayunas (rayos X y análisis de sangre)",
    "Terapia física por lesión en hombro durante práctica deportiva",
    "Consulta oftalmológica urgente por visión borrosa",
    "Tratamiento dental programado para endodoncia",
    "Cita con traumatólogo por esguince de tobillo",
    "Control post-operatorio en clínica particular",
    "Resonancia magnética programada para revisión de rodilla",
    "Cita dermatológica para evaluación de lesiones en piel",
    "Consulta cardiológica de seguimiento anual",
    "Extracción de muelas cordales bajo sedación",
    "Cita con nutricionista por problemas digestivos crónicos",
    "Evaluación neurológica por dolores de cabeza recurrentes",
    "Terapia de rehabilitación por fractura en muñeca",
    "Control médico preventivo solicitado por empresa",
    "Cita con otorrino por infección en oído medio",
    "Consulta psicológica por estrés laboral diagnosticado",
    "Ecografía abdominal solicitada por médico de cabecera",
    "Pruebas alérgicas programadas en centro especializado",
    "Cita urgente con urólogo por malestar renal",
    "Consulta ginecológica de control trimestral",
    "Tratamiento quiropráctico por contracturas cervicales severas",
    "Evaluación pulmonar por bronquitis crónica",
    "Cita con gastroenterólogo por reflujo persistente",
    "Control diabetológico mensual obligatorio",
    "Vacunación obligatoria fuera del horario laboral",
    "Análisis médicos preventivos solicitados por aseguradora",
    "Cita con podólogo por fascitis plantar diagnosticada",
    "Consulta con endocrinólogo por desbalance hormonal",
    "Evaluación médica pre-quirúrgica programada",
    "Sesión de fisioterapia respiratoria post-COVID",
    "Cita urgente por reacción alérgica a medicamento",
    "Control médico por hipertensión arterial",
    "Consulta reumatológica por dolor articular crónico",
    "Cita con hematólogo por análisis de sangre anormales",
    "Evaluación por fatiga crónica persistente",
    "Tratamiento de acupuntura médica prescrita",
    "Consulta de urgencia por infección respiratoria aguda",
    "Cita con nefrólogo por seguimiento renal",
    "Evaluación psiquiátrica por ansiedad diagnosticada",
    "Control post-COVID en clínica especializada",
    "Cita con cirujano para evaluación de hernia",
    "Tratamiento con medicina física por ciática",
    "Consulta oncológica preventiva familiar",
    "Evaluación audiológica por pérdida auditiva progresiva"
  ]

  const vacationReasons = [
    "Viaje familiar programado a Cusco para conocer Machu Picchu",
    "Descanso anual pendiente del año anterior",
    "Visita a parientes en provincia de Arequipa",
    "Celebración de 10° aniversario de matrimonio",
    "Viaje al extranjero (Colombia) por turismo familiar",
    "Trámites personales pendientes y descanso programado",
    "Remodelación de vivienda que requiere supervisión personal",
    "Asuntos familiares urgentes en ciudad natal",
    "Viaje de bodas pospuesto por pandemia",
    "Visita a padres enfermos en región selva",
    "Vacaciones escolares de hijos, tiempo en familia",
    "Viaje a playa del norte programado hace meses",
    "Participación en retiro espiritual anual",
    "Descanso médico recomendado por estrés laboral",
    "Viaje a Lima para trámites de documentación",
    "Acompañamiento a familiar en tratamiento médico en otra ciudad",
    "Celebración de cumpleaños número 50",
    "Viaje educativo con hijos durante vacaciones escolares",
    "Asistencia a boda de hermano en provincia",
    "Vacaciones para recuperación física y mental",
    "Viaje programado a Puno y Lago Titicaca",
    "Tiempo personal para estudios de especialización",
    "Visita a hijos que estudian en otra ciudad",
    "Participación en evento familiar importante",
    "Descanso por acumulación de días pendientes",
    "Viaje mochilero por el sur del Perú",
    "Vacaciones para mudanza a nuevo domicilio",
    "Celebración de graduación universitaria de hijo",
    "Viaje a Iquitos para visita familiar",
    "Tiempo libre para preparación de examen profesional",
    "Vacaciones programadas desde inicio de año",
    "Viaje con pareja a Paracas y reserva natural",
    "Descanso antes de inicio de proyecto importante",
    "Acompañamiento a esposa en viaje de trabajo",
    "Vacaciones para realizar curso de capacitación personal",
    "Viaje a Ecuador por reunión familiar anual",
    "Tiempo en casa para cuidar a familiar convaleciente",
    "Vacaciones coordinadas con equipo de trabajo",
    "Viaje de aventura a Huaraz para trekking",
    "Celebración de aniversario de padres (bodas de oro)",
    "Descanso para recuperación de energía laboral",
    "Viaje a Trujillo por festival y turismo",
    "Vacaciones para acompañar a hijos en competencia deportiva",
    "Tiempo libre para trámites de herencia familiar",
    "Viaje programado a Chile por turismo",
    "Vacaciones para participar en curso online intensivo",
    "Descanso preventivo solicitado por médico ocupacional",
    "Viaje familiar a Ayacucho por Semana Santa",
    "Tiempo personal para matrimonio religioso",
    "Vacaciones para resolver asuntos legales pendientes"
  ]

  const compensatoryReasons = [
    "Compensación por horas extras del último mes",
    "Día libre por trabajo durante feriado del 28 de julio",
    "Recuperación de horas por cierre exitoso de proyecto urgente",
    "Compensación acordada por jornada extendida en inventario",
    "Horas acumuladas por trabajo en fin de semana pasado",
    "Compensación por turno nocturno extraordinario",
    "Día libre por trabajo en día domingo",
    "Recuperación de horas por guardia de emergencia",
    "Compensación por viaje de trabajo fuera de horario",
    "Horas extras acumuladas durante cierre mensual",
    "Día compensatorio por trabajo en feriado de Año Nuevo",
    "Recuperación de tiempo por capacitación en día libre",
    "Compensación acordada por apoyo en mudanza de oficina",
    "Horas acumuladas durante auditoría externa",
    "Día libre por trabajo en feriado de Navidad",
    "Compensación por jornada continua sin descanso",
    "Recuperación de horas por reunión nocturna con cliente",
    "Día compensatorio por trabajo en feriado regional",
    "Horas extras del mes anterior aprobadas por gerencia",
    "Compensación por cobertura de turno de compañero enfermo"
  ]

  const personalReasons = [
    "Trámites urgentes en notaría para escritura pública",
    "Matrimonio de hermano menor este fin de semana",
    "Asistencia a ceremonia de graduación de hijo en colegio",
    "Mudanza definitiva a nuevo departamento alquilado",
    "Resolución de demanda civil en juzgado",
    "Trámite de renovación de DNI y pasaporte",
    "Participación como testigo en audiencia judicial",
    "Asistencia a bautizo de sobrino",
    "Trámites bancarios para aprobación de préstamo hipotecario",
    "Cita en Migraciones para trámite de visa",
    "Asistencia a primera comunión de hija",
    "Gestión de documentos en Registros Públicos",
    "Funeral de familiar cercano fallecido recientemente",
    "Trámites en SUNARP para transferencia vehicular",
    "Participación en junta de propietarios obligatoria",
    "Gestión de herencia familiar en notaría",
    "Asistencia obligatoria a citación judicial",
    "Trámite urgente en municipalidad para licencia",
    "Ceremonia religiosa importante de familiar",
    "Gestión de divorcio en sede judicial",
    "Trámites para adopción en proceso",
    "Asistencia a quinceañero de sobrina",
    "Gestión de seguro vehicular tras accidente",
    "Firma de contrato de compraventa de propiedad",
    "Trámite de pensión alimenticia en juzgado",
    "Asistencia a evento escolar como padre de familia",
    "Gestión de reclamo administrativo en Indecopi",
    "Inscripción de hijo en nueva institución educativa",
    "Trámites consulares urgentes para familiar",
    "Asistencia a velorio de familiar político"
  ]

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

    const type = types[i % 2]
    const reasons = type === "Licencia por Enfermedad" ? sickReasons : compensatoryReasons
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)]

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
      observations: randomReason,
      evidence: i % 2 === 0,
    })
  }

  // 2. Manager Requests (Other Employees)
  // Requirement: Many requests, distinct names, realistic simulation
  const firstNames = ["Juan", "María", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Sofia", "Miguel", "Lucía"]
  const lastNames = ["Pérez", "García", "López", "Martínez", "Rodríguez", "González", "Sánchez", "Ramírez", "Torres", "Flores"]
  const areas = ["Logística", "Operaciones", "RRHH", "Finanzas", "TI", "Ventas"]

  // Re-define types for manager requests to include Vacations
  const managerTypes = ["Vacaciones", "Licencia por Enfermedad", "Compensatorio", "Permiso Personal"]

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

    const type = managerTypes[Math.floor(Math.random() * managerTypes.length)] as any
    let reasonPool = vacationReasons
    if (type === "Licencia por Enfermedad") reasonPool = sickReasons
    else if (type === "Compensatorio") reasonPool = compensatoryReasons
    else if (type === "Permiso Personal") reasonPool = personalReasons

    const randomReason = reasonPool[Math.floor(Math.random() * reasonPool.length)]

    requests.push({
      id: reqId,
      employeeId: `emp-${100 + i}`,
      employeeName: `${fName} ${lName}`,
      type: type,
      startDate: dateStr,
      endDate: endDateStr,
      totalDays: duration,
      workSite: area,
      status: status as any,
      createdAt: dateStr,
      observations: randomReason,
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
    if (localStorage.getItem("elm-requests-v3")) {
      console.log("🧹 Cleaning up old data (v3)...")
      localStorage.removeItem("elm-requests-v3")
    }

    // UPDATED KEY TO V4 TO FORCE RESET (Fix unique observations)
    const saved = localStorage.getItem("elm-requests-v4")
    if (saved) {
      try {
        setRequests(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse requests", e)
        setRequests(generateMockRequests())
      }
    } else {
      console.log("🔄 Initializing with fresh mock data (v4 unique observations)...")
      setRequests(generateMockRequests())
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage whenever requests change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("elm-requests-v4", JSON.stringify(requests))
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
