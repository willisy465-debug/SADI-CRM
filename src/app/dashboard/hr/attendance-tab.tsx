"use client"

import { useState } from "react"
import { MapPin, Clock, LogIn, LogOut, AlertTriangle, CheckCircle2 } from "lucide-react"
import { checkIn, checkOut } from "./attendance-actions"

export function AttendanceTab({ records, hasProfile }: { records: any[], hasProfile: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const today = new Date()
  const todayRecord = records.find(r => 
    new Date(r.date).toDateString() === today.toDateString()
  )

  const isCheckedIn = !!todayRecord && !todayRecord.checkOutTime
  const isCompleted = !!todayRecord && !!todayRecord.checkOutTime

  async function handleAction(type: 'IN' | 'OUT') {
    setError("")
    setSuccess("")
    setLoading(true)

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          if (type === 'IN') {
            await checkIn(latitude, longitude)
            setSuccess("Successfully checked in!")
          } else {
            await checkOut(latitude, longitude)
            setSuccess("Successfully checked out!")
          }
        } catch (err: any) {
          setError(err.message || "An error occurred during verification.")
        } finally {
          setLoading(false)
        }
      },
      (geoError) => {
        setError("Unable to retrieve your location. Please ensure location services are enabled.")
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  if (!hasProfile) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Staff Profile Required</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          You need an active staff profile to access the attendance and time tracking module.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Today's Attendance</h2>
          <p className="text-sm text-slate-500 mt-1 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-brand-cyan" />
            Geofence active: Must be within 20m of Pretoria or Nairobi campus
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-100 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-100 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {success}
            </div>
          )}

          {isCompleted ? (
            <div className="bg-slate-100 text-slate-600 px-6 py-3 rounded-lg flex items-center border border-slate-200">
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Shift Completed
            </div>
          ) : isCheckedIn ? (
            <button
              onClick={() => handleAction('OUT')}
              disabled={loading}
              className="bg-brand-navy hover:bg-brand-navy/90 text-white px-8 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center"><Clock className="w-5 h-5 mr-2 animate-spin" /> Verifying Location...</span>
              ) : (
                <span className="flex items-center"><LogOut className="w-5 h-5 mr-2" /> Check Out</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => handleAction('IN')}
              disabled={loading}
              className="bg-brand-cyan hover:bg-brand-cyan/90 text-white px-8 py-3 rounded-lg font-medium shadow-sm transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center"><Clock className="w-5 h-5 mr-2 animate-spin" /> Verifying Location...</span>
              ) : (
                <span className="flex items-center"><LogIn className="w-5 h-5 mr-2" /> Check In</span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-semibold text-slate-900">Attendance History (Last 30 Days)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-white border-b border-slate-200 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Campus</th>
                <th className="px-6 py-4 font-medium">Check In</th>
                <th className="px-6 py-4 font-medium">Check Out</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Overtime (Hrs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.location?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.checkOutTime 
                        ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : <span className="text-brand-cyan">Active</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        record.status === "PRESENT" ? "bg-green-50 text-green-700 border-green-200" :
                        "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {record.overtimeHours > 0 ? (
                        <span className="text-brand-cyan">+{record.overtimeHours.toFixed(1)}</span>
                      ) : (
                        <span className="text-slate-400">0.0</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
