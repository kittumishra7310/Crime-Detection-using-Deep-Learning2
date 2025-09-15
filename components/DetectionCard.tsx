"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangleIcon, CheckCircleIcon, ClockIcon } from "@/components/icons"

interface Detection {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  timestamp: string
  cameraId: string
  confidence: number
}

interface DetectionCardProps {
  detection: Detection
}

export function DetectionCard({ detection }: DetectionCardProps) {
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangleIcon className="h-4 w-4" />
      case "medium":
        return <ClockIcon className="h-4 w-4" />
      case "low":
        return <CheckCircleIcon className="h-4 w-4" />
      default:
        return <CheckCircleIcon className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-100">{detection.type}</CardTitle>
          <Badge className={getSeverityColor(detection.severity)}>
            {getSeverityIcon(detection.severity)}
            <span className="ml-1 capitalize">{detection.severity}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Camera:</span>
            <span className="text-slate-200">{detection.cameraId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Confidence:</span>
            <span className="text-slate-200">{(detection.confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Time:</span>
            <span className="text-slate-200">{new Date(detection.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
