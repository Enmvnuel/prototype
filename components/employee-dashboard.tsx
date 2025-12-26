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

          {/* Cards Row */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Green Card - Vacation */}
            <m.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-500 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20 w-full md:w-80 relative overflow-hidden group cursor-pointer"
            >
              <div className="relative z-10 font-sans">
                <p className="font-medium text-emerald-50 mb-2 opacity-90">Vacaciones Acumuladas</p>
                <h3 className="text-5xl font-extrabold mb-4 tracking-tight">{balance.vacation} días</h3>
                <p className="text-xs text-emerald-100 opacity-80 underline decoration-emerald-300 underline-offset-2">Última actualización: Marzo de Tiempo</p>
              </div>
              <div className="absolute -right-8 -bottom-12 w-48 h-48 bg-emerald-400/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 ease-in-out"></div>
            </m.div>

            {/* Blue Card - Compensatory */}
            <m.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20 w-full md:w-80 relative overflow-hidden group cursor-pointer"
            >
              <div className="relative z-10 font-sans">
                <p className="font-medium text-blue-50 mb-2 opacity-90">Tiempo Compensatorio</p>
                <h3 className="text-5xl font-extrabold mb-4 tracking-tight">{balance.compensatory} días</h3>
                <p className="text-xs text-blue-100 opacity-80 underline decoration-blue-400 underline-offset-2">Última actualización: Marzo de Tiempo</p>
              </div>
              <div className="absolute -right-8 -bottom-12 w-48 h-48 bg-blue-500/40 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 ease-in-out"></div>
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
