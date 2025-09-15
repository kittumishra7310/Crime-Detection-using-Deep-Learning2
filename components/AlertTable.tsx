"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Clock, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Alert {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  timestamp: string
  cameraId: string
  status: "active" | "acknowledged" | "resolved"
  actionTaken: string
  description: string
}

interface AlertTableProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
  onResolve: (id: string) => void
}

export function AlertTable({ alerts, onAcknowledge, onResolve }: AlertTableProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-600 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      case "low":
        return "bg-green-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-600 text-white"
      case "acknowledged":
        return "bg-yellow-600 text-white"
      case "resolved":
        return "bg-green-600 text-white"
      default:
        return "bg-slate-600 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4" />
      case "acknowledged":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100">Alert Management</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-300 font-medium">Alert</th>
                <th className="text-left p-4 text-slate-300 font-medium">Severity</th>
                <th className="text-left p-4 text-slate-300 font-medium">Status</th>
                <th className="text-left p-4 text-slate-300 font-medium">Camera</th>
                <th className="text-left p-4 text-slate-300 font-medium">Timestamp</th>
                <th className="text-left p-4 text-slate-300 font-medium">Action Taken</th>
                <th className="text-left p-4 text-slate-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-slate-100">{alert.type}</div>
                      <div className="text-sm text-slate-400">{alert.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(alert.status)}>
                      {getStatusIcon(alert.status)}
                      <span className="ml-1 capitalize">{alert.status}</span>
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-200">{alert.cameraId}</td>
                  <td className="p-4 text-slate-200">
                    <div>{new Date(alert.timestamp).toLocaleDateString()}</div>
                    <div className="text-sm text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td className="p-4 text-slate-200">{alert.actionTaken}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-700 border-slate-600">
                        {alert.status === "active" && (
                          <DropdownMenuItem
                            onClick={() => onAcknowledge(alert.id)}
                            className="text-slate-200 hover:bg-slate-600"
                          >
                            Acknowledge
                          </DropdownMenuItem>
                        )}
                        {alert.status !== "resolved" && (
                          <DropdownMenuItem
                            onClick={() => onResolve(alert.id)}
                            className="text-slate-200 hover:bg-slate-600"
                          >
                            Mark Resolved
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-slate-200 hover:bg-slate-600">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
