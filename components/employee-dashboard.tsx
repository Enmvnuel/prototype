"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import { LogOut, Plus, Calendar, Clock, ChevronDown } from "lucide-react"
import { m, LazyMotion, domAnimation } from "framer-motion"

interface EmployeeDashboardProps {
  onCreateRequest: () => void
  onLogout: () => void
}

export default function EmployeeDashboard({ onCreateRequest, onLogout }: EmployeeDashboardProps) {
  const { requests, getEmployeeBalance } = useAppContext()
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const employeeId = "emp001"
  const balance = getEmployeeBalance(employeeId)
  const employeeRequests = requests.filter((r) => r.employeeId === employeeId)

  // Extract unique years/months for the filter dropdown
  const uniqueMonths = useMemo(() => {
    const months = new Set<string>()
    employeeRequests.forEach(req => {
      months.add(req.createdAt.substring(0, 7))
    })
    return Array.from(months).sort().reverse()
  }, [employeeRequests])

  const filteredRequests = useMemo(() => {
    return employeeRequests.filter((req) => {
      if (filterMonth !== "all") {
        const reqMonth = req.createdAt.substring(0, 7)
        if (reqMonth !== filterMonth) return false
      }
      if (filterStatus !== "all" && req.status !== filterStatus) return false
      return true
    })
  }, [employeeRequests, filterMonth, filterStatus])

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDIENTE: { bg: "bg-yellow-100", text: "text-yellow-700", label: "En Revisión" },
      APROBADO: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Aprobado" },
      RECHAZADO: { bg: "bg-red-100", text: "text-red-700", label: "Rechazado" },
    }
    const variant = variants[status] || variants.PENDIENTE
    return (
      <Badge className={`${variant.bg} ${variant.text} border-0 px-3 py-1 font-medium rounded-full shadow-sm`}>
        {variant.label}
      </Badge>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-slate-50/50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">
                E
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Portal del Empleado</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide disabled:opacity-50">SISTEMA INTEGRAL DE LICENCIAS</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                Sesión Activa: Empleado
              </div>
              <Button onClick={onLogout} variant="ghost" className="text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* Welcome & Stats Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Resumen de Balance</h2>
                <p className="text-slate-500 mb-6">Días disponibles actualizados</p>

                <div className="space-y-4">
                  <div className="group p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="opacity-80 text-xs font-semibold uppercase tracking-wider">Vacaciones</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight">{balance.vacation}</span>
                      <span className="text-lg opacity-80">días</span>
                    </div>
                  </div>

                  <div className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors hover:shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Clock className="w-5 h-5" />
                      </div>
                      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Compensatorio</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900 tracking-tight">{balance.compensatory}</span>
                      <span className="text-lg text-slate-400">días</span>
                    </div>
                  </div>
                </div>

                <Button onClick={onCreateRequest} className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-95 group">
                  <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                  Nueva Solicitud
                </Button>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-sm overflow-hidden h-full rounded-3xl">
                <CardHeader className="border-b border-slate-100 p-6 bg-white flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Historial de Solicitudes</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Registro completo de actividades desde 2020</p>
                  </div>

                  {/* Compact Filters */}
                  <div className="flex gap-3">
                    <Select value={filterMonth} onValueChange={setFilterMonth}>
                      <SelectTrigger className="w-[160px] h-10 rounded-full border-slate-200 bg-slate-50/50">
                        <SelectValue placeholder="Periodo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todo el historial</SelectItem>
                        {uniqueMonths.map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[160px] h-10 rounded-full border-slate-200 bg-slate-50/50">
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="PENDIENTE">En Revisión</SelectItem>
                        <SelectItem value="APROBADO">Aprobados</SelectItem>
                        <SelectItem value="RECHAZADO">Rechazados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-slate-100 hover:bg-transparent">
                          <TableHead className="w-[120px] font-semibold text-slate-600 pl-6">ID</TableHead>
                          <TableHead className="font-semibold text-slate-600">Fecha Solicitud</TableHead>
                          <TableHead className="font-semibold text-slate-600">Tipo</TableHead>
                          <TableHead className="font-semibold text-slate-600">Periodo</TableHead>
                          <TableHead className="text-center font-semibold text-slate-600">Días</TableHead>
                          <TableHead className="font-semibold text-slate-600">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-64 text-center">
                              <div className="flex flex-col items-center justify-center text-slate-400">
                                <span className="text-4xl mb-3">📭</span>
                                <p>No se encontraron registros</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRequests.map((req, index) => (
                            <m.tr
                              key={req.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="group hover:bg-slate-50/80 transition-colors border-slate-100"
                            >
                              <TableCell className="font-medium text-slate-900 pl-6 group-hover:text-blue-600 transition-colors">
                                {req.id}
                              </TableCell>
                              <TableCell className="text-slate-500">{req.createdAt}</TableCell>
                              <TableCell>
                                <span className="font-medium text-slate-700">{req.type}</span>
                              </TableCell>
                              <TableCell className="text-slate-600">
                                <div className="flex flex-col text-xs">
                                  <span>{req.startDate}</span>
                                  <span className="text-slate-400">al</span>
                                  <span>{req.endDate}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-semibold text-slate-700">
                                {req.totalDays}
                              </TableCell>
                              <TableCell>{getStatusBadge(req.status)}</TableCell>
                            </m.tr>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredRequests.length > 0 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center text-xs text-slate-500 font-medium uppercase tracking-widest">
                      Mostrando {filteredRequests.length} registros
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

        </main>
      </div>
    </LazyMotion>
  )
}
