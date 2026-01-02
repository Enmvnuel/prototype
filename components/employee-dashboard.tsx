"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppContext } from "@/context/app-context"
import { LogOut, Search, Eye, Plus, Calendar, Clock } from "lucide-react"
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
  // const employeeName = "Bryan Lopez" // Hardcoded for demo
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

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const filteredRequests = useMemo(() => {
    let result = employeeRequests.filter((req) => {
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

    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [employeeRequests, filterMonth, filterStatus, searchQuery, sortConfig])

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
      return <Badge className="bg-yellow-100 text-yellow-700 border-0 rounded-full font-medium px-4 shadow-none">Pendiente</Badge>
    } else if (status === "APROBADO") {
      return <Badge className="bg-teal-100 text-teal-700 border-0 rounded-full font-medium px-4 shadow-none">Aprobado</Badge>
    } else {
      return <Badge className="bg-pink-100 text-pink-700 border-0 rounded-full font-medium px-4 shadow-none">Rechazado</Badge>
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return <span className="ml-1 text-slate-300 opacity-50">↕</span>
    return sortConfig.direction === 'asc' ? <span className="ml-1 text-primary">↑</span> : <span className="ml-1 text-primary">↓</span>
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#FDFDFC] font-sans text-slate-600 pb-20">

        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <span className="font-serif">E</span>
              </div>
              <span className="font-serif text-xl font-bold text-slate-800">Employee Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-right hidden sm:block">
                <span className="font-bold text-slate-800 block">Bryan Lopez</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">Empleado</span>
              </div>
              <Button onClick={onLogout} variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">

          {/* Intro Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl text-slate-800 mb-2">My Dashboard</h1>
              <p className="text-slate-400 font-light text-lg">Manage your time off efficiently and stress-free.</p>
            </div>
            <Button onClick={onCreateRequest} className="rounded-full h-14 px-8 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 text-lg font-medium transition-all hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5 mr-2" /> Nueva Solicitud
            </Button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vacation Balance */}
            <m.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex flex-col justify-between h-[340px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-purple-100" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Balance</span>
                </div>

                <h2 className="font-serif text-7xl text-slate-800">{balance.vacation}</h2>
                <p className="text-lg text-slate-500 font-medium">Días de Vacaciones</p>
              </div>

              <div className="relative z-10 mt-auto pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Disponible ahora
                </p>
              </div>
            </m.div>

            {/* Compensatory Balance */}
            <m.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex flex-col justify-between h-[340px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-all group-hover:bg-teal-100" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-400 uppercase text-xs tracking-widest">Extra</span>
                </div>

                <h2 className="font-serif text-7xl text-slate-800">{balance.compensatory}</h2>
                <p className="text-lg text-slate-500 font-medium">Horas Compensatorias</p>
              </div>

              <div className="relative z-10 mt-auto pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Expira en Dic 2025
                </p>
              </div>
            </m.div>

            {/* Chart */}
            <m.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 h-[340px]"
            >
              <RequestStatusChart requests={employeeRequests} title="Resumen" />
            </m.div>
          </div>

          {/* Recent History Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-serif text-2xl text-slate-800">Historial Reciente</h3>

              {/* Search & Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 h-10 rounded-full border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-purple-100 outline-none w-[200px]"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] rounded-full border-slate-200 h-10">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                    <SelectItem value="APROBADO">Aprobado</SelectItem>
                    <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-b-slate-100 hover:bg-transparent">
                    <TableHead className="py-5 pl-8 font-medium text-slate-400 text-xs uppercase tracking-wider cursor-pointer" onClick={() => handleSort('createdAt')}>Fecha <SortIcon column="createdAt" /></TableHead>
                    <TableHead className="py-5 font-medium text-slate-400 text-xs uppercase tracking-wider cursor-pointer" onClick={() => handleSort('type')}>Tipo <SortIcon column="type" /></TableHead>
                    <TableHead className="py-5 font-medium text-slate-400 text-xs uppercase tracking-wider">Duración</TableHead>
                    <TableHead className="py-5 font-medium text-slate-400 text-xs uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>Estado <SortIcon column="status" /></TableHead>
                    <TableHead className="py-5 pr-8 text-right font-medium text-slate-400 text-xs uppercase tracking-wider">Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center text-slate-400">
                        Sin resultados encontrados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRequests.map((req, index) => (
                      <m.tr
                        key={req.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-50 hover:bg-purple-50/30 transition-colors cursor-pointer group"
                      >
                        <TableCell className="pl-8 py-4 font-medium text-slate-700">{req.createdAt}</TableCell>
                        <TableCell className="py-4 text-slate-600">{req.type}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">{req.totalDays} Días</span>
                            <span className="text-xs text-slate-400">{req.startDate} - {req.endDate}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">{getStatusBadge(req.status)}</TableCell>
                        <TableCell className="pr-8 py-4 text-right">
                          <Button onClick={() => handleOpenModal(req)} variant="ghost" size="icon" className="rounded-full hover:bg-white hover:shadow-md text-slate-400 hover:text-primary transition-all">
                            <Eye className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </m.tr>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => c - 1)}
                    className="rounded-full text-slate-400 hover:text-slate-800"
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center text-slate-400 text-sm px-4">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => c + 1)}
                    className="rounded-full text-slate-400 hover:text-slate-800"
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </div>
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
