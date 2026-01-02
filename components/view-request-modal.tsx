"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { RequestData } from "@/context/app-context"
import { X, FileText, User, Calendar, MapPin, Clock, Info, CheckCircle, AlertCircle } from "lucide-react"

interface ViewRequestModalProps {
    request: RequestData
    onClose: () => void
}

export default function ViewRequestModal({ request, onClose }: ViewRequestModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

            {/* Modal */}
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-60 bg-[#FDFDFC] border-0 rounded-[2rem] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-50 flex flex-row items-center justify-between p-6">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            Detalle de Solicitud
                        </p>
                        <CardTitle className="text-2xl font-serif text-slate-800">Referencia: #{request.id}</CardTitle>
                    </div>
                    <Button onClick={onClose} variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 text-slate-400">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <CardContent className="p-8 space-y-8">
                    {/* Status Banner */}
                    <div className={`flex items-center justify-between p-6 rounded-3xl border ${request.status === 'APROBADO' ? 'bg-teal-50 border-teal-100' :
                            request.status === 'RECHAZADO' ? 'bg-pink-50 border-pink-100' : 'bg-yellow-50 border-yellow-100'
                        }`}>
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 ${request.status === 'APROBADO' ? 'bg-teal-500' :
                                    request.status === 'RECHAZADO' ? 'bg-pink-500' : 'bg-yellow-500'
                                }`}>
                                {request.status === 'APROBADO' ? <CheckCircle className="w-7 h-7" /> :
                                    request.status === 'RECHAZADO' ? <X className="w-7 h-7" /> :
                                        <Clock className="w-7 h-7" />}
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 font-medium mb-1">Estado Actual</p>
                                <div className="flex items-center gap-3">
                                    <h3 className={`text-2xl font-serif font-bold ${request.status === 'APROBADO' ? 'text-teal-700' :
                                            request.status === 'RECHAZADO' ? 'text-pink-700' : 'text-yellow-700'
                                        }`}>
                                        {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-tight mb-1">Solicitado el</p>
                            <p className="text-slate-700 font-bold bg-white px-3 py-1 rounded-full text-sm shadow-sm inline-block">{request.createdAt}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Information Column */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                                <Info className="w-4 h-4 text-primary" />
                                Información General
                            </h4>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm">
                                    <div className="p-2.5 bg-purple-50 rounded-xl text-primary">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Solicitante</p>
                                        <p className="text-base font-medium text-slate-700">{request.employeeName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm">
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Sede</p>
                                        <p className="text-base font-medium text-slate-700">{request.workSite}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-50 shadow-sm">
                                    <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Tipo de Permiso</p>
                                        <p className="text-base font-medium text-slate-700">{request.type}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dates & Duration Column */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                                <Calendar className="w-4 h-4 text-primary" />
                                Periodo
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white rounded-3xl border border-slate-50 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-wider">Desde</p>
                                    <p className="font-serif text-xl text-slate-800">{request.startDate}</p>
                                </div>
                                <div className="p-5 bg-white rounded-3xl border border-slate-50 shadow-sm">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-wider">Hasta</p>
                                    <p className="font-serif text-xl text-slate-800">{request.endDate}</p>
                                </div>
                                <div className="col-span-2 p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:bg-white/20 transition-all"></div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <div>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Duración Total</p>
                                            <p className="text-4xl font-serif">{request.totalDays} <span className="text-lg font-sans font-light text-white/60">Días</span></p>
                                        </div>
                                        <Clock className="w-10 h-10 text-white/20" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observations */}
                    <div className="space-y-6">
                        <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Tus Observaciones</h4>
                            <p className="text-slate-600 text-sm leading-relaxed italic font-medium">
                                "{request.observations || 'Sin observaciones adicionales'}"
                            </p>
                        </div>

                        {request.managerNotes && (
                            <div className={`p-6 rounded-[1.5rem] border ${request.status === 'RECHAZADO' ? 'bg-pink-50 border-pink-100' : 'bg-teal-50 border-teal-100'
                                }`}>
                                <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${request.status === 'RECHAZADO' ? 'text-pink-600' : 'text-teal-600'
                                    }`}>
                                    <AlertCircle className="w-4 h-4" />
                                    Respuesta del Evaluador
                                </h4>
                                <p className="text-slate-800 text-sm font-medium leading-relaxed">
                                    {request.managerNotes}
                                </p>
                                {request.reviewedAt && (
                                    <p className="text-[10px] text-slate-400/80 mt-4 uppercase font-bold">
                                        Evaluado el: {request.reviewedAt}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>

                <div className="p-6 border-t border-slate-100 bg-white/50 backdrop-blur-md flex justify-end rounded-b-[2rem]">
                    <Button
                        onClick={onClose}
                        className="px-8 py-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full shadow-lg shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95"
                    >
                        Cerrar Detalle
                    </Button>
                </div>
            </Card>
        </div>
    )
}
