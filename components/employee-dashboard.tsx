"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import { LogOut, Search, Eye } from "lucide-react"
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion"
import ViewRequestModal from "./view-request-modal"
import RequestStatusChart from "./request-status-chart"

interface EmployeeDashboardProps {
  onCreateRequest: () => void
  onLogout: () => void
}

export default function EmployeeDashboard({ onCreateRequest, onLogout }: EmployeeDashboardProps) {
  const { requests, getEmployeeBalance } = useAppContext()
  const [filterMonth, setFilterMonth] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const employeeId = "emp001"
  const employeeName = "Nombre del Empleado"
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

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          req.id.toLowerCase().includes(query) ||
          req.type.toLowerCase().includes(query) ||
          req.workSite.toLowerCase().includes(query)
        )
      }

      return true
    })
  }, [employeeRequests, filterMonth, filterStatus, searchQuery])

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleOpenModal = (req: any) => {
    setSelectedRequest(req)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    if (status === "PENDIENTE") {
      return <Badge className="bg-yellow-400 text-yellow-900 border-0 hover:bg-yellow-500 rounded-md font-bold px-3 shadow-sm">PENDIENTE</Badge>
    } else if (status === "APROBADO") {
      return <Badge className="bg-green-500 text-white border-0 hover:bg-green-600 rounded-md font-bold px-3 shadow-sm">APROBADO</Badge>
    } else {
      return <Badge className="bg-red-500 text-white border-0 hover:bg-red-600 rounded-md font-bold px-3 shadow-sm">RECHAZADO</Badge>
    }
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

        {/* Top Navigation / Breadcrumb */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-sm font-medium text-slate-500">
              <span className="text-slate-900 hover:text-slate-700 cursor-pointer transition-colors">Inicio</span> &gt; Mis Solicitudes &gt; <span className="text-slate-900 font-semibold">Historial</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-right hidden sm:block">
                <span className="font-bold text-slate-800 block">Bryan Lopez</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">EMPLEADO</span>
              </div>
              <Button onClick={onLogout} variant="ghost" size="sm" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {/* Section Title */}
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard de Saldo Personal</h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Green Card - Vacation */}
            <m.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group flex flex-col justify-between min-h-[400px]"
            >
              <div className="relative z-10 font-sans h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-bold text-slate-500 uppercase text-xs tracking-wider">Vacaciones</p>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-6xl font-extrabold tracking-tight text-slate-800">{balance.vacation}</h3>
                  <span className="text-xl font-medium text-slate-400 -mt-1">días disponibles</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-xs text-slate-400 font-medium">Estado: Activo y acumulando</p>
                </div>
              </div>

              {/* Decorative gradient blob */}
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-50/50 rounded-full blur-3xl group-hover:bg-emerald-100/50 transition-colors duration-500"></div>
            </m.div>

            {/* Blue Card - Compensatory */}
            <m.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group flex flex-col justify-between min-h-[400px]"
            >
              <div className="relative z-10 font-sans h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-bold text-slate-500 uppercase text-xs tracking-wider">Compensatorio</p>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="text-6xl font-extrabold tracking-tight text-slate-800">{balance.compensatory}</h3>
                  <span className="text-xl font-medium text-slate-400 -mt-1">horas/días</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <p className="text-xs text-slate-400 font-medium">Caduca: Diciembre 2025</p>
                </div>
              </div>

              {/* Decorative gradient blob */}
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors duration-500"></div>
            </m.div>

            {/* Chart Card */}
            <m.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
              className="min-h-[400px]"
            >
              <RequestStatusChart
                requests={employeeRequests}
                title="Estado de Mis Solicitudes"
                className="rounded-2xl border-none shadow-xl shadow-slate-200/50"
              />
            </m.div>
          </div>

          {/* Filter Bar */}
          <div className="bg-slate-100 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 border border-slate-200 shadow-sm">
            <div className="flex-1 w-full flex items-center gap-4">
              <h3 className="text-slate-700 font-bold text-sm whitespace-nowrap bg-slate-200/50 px-3 py-1.5 rounded-lg">Filtros de Historial</h3>
              <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Búsqueda por Palabra Clave (ID, Tipo, Sede)"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-700 bg-white placeholder:text-slate-400 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-[160px] bg-white border-slate-200 shadow-sm font-medium text-slate-600 h-10 rounded-lg focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Mes/Año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo</SelectItem>
                  {uniqueMonths.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[160px] bg-white border-slate-200 shadow-sm font-medium text-slate-600 h-10 rounded-lg focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                  <SelectItem value="APROBADO">APROBADO</SelectItem>
                  <SelectItem value="RECHAZADO">RECHAZADO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data Grid Title */}
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Cuadrícula de Datos del Historial de Solicitudes</h2>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-black/5">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider w-[140px] pl-6 py-4">ID Solicitud</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Fecha de Envío</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Tipo de Licencia</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Fechas Solicitadas</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider w-[100px] text-center py-4">Días</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider py-4">Sede Asignada</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider w-[140px] py-4">Estado</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-right pr-6 py-4">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center text-slate-400">
                      No se encontraron registros que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRequests.map((req, index) => (
                    <m.tr
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors h-[72px] group"
                    >
                      <TableCell className="font-semibold text-slate-700 pl-6 group-hover:text-blue-600 transition-colors">{req.id}</TableCell>
                      <TableCell className="text-slate-500 font-medium text-sm">{req.createdAt}</TableCell>
                      <TableCell className="text-slate-700 font-medium">{req.type}</TableCell>
                      <TableCell className="text-slate-500 font-medium text-sm">{req.startDate} <span className="text-slate-300 mx-1">/</span> {req.endDate}</TableCell>
                      <TableCell className="text-slate-700 font-bold text-center bg-slate-50/50 m-1 rounded-lg">{req.totalDays}</TableCell>
                      <TableCell className="text-slate-600 font-medium">{req.workSite}</TableCell>
                      <TableCell>{getStatusBadge(req.status)}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-2 text-slate-400">
                          <button
                            onClick={() => handleOpenModal(req)}
                            className="hover:text-blue-600 hover:bg-blue-50 transition-all p-2 rounded-lg group/btn hover:shadow-sm ring-1 ring-transparent hover:ring-blue-100"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                      </TableCell>
                    </m.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer / Pagination Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-6 border-t border-slate-200/60 mt-8">
            <div className="flex items-center gap-6 text-sm font-bold text-slate-400 select-none">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-all flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                &lt; Anterior
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <span
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all ${currentPage === page
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "hover:bg-slate-100 hover:text-blue-600"
                      }`}
                  >
                    {page}
                  </span>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-md transition-all flex items-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Siguiente &gt;
              </button>
              <span className="text-slate-400 font-medium ml-4 text-xs tracking-wide uppercase border-l pl-6 border-slate-200">
                Mostrando {paginatedRequests.length} de {filteredRequests.length} registros
              </span>
            </div>

            <Button onClick={onCreateRequest} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-7 rounded-xl shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95 text-base shine-effect overflow-hidden relative">
              <span className="relative z-10 flex items-center gap-2">[ + ] NUEVA SOLICITUD</span>
            </Button>
          </div>

        </main>

        <AnimatePresence>
          {isModalOpen && selectedRequest && (
            <ViewRequestModal
              request={selectedRequest}
              onClose={() => {
                setIsModalOpen(false)
                setSelectedRequest(null)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  )
}
