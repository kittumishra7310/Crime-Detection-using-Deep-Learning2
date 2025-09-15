"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Camera {
  id: string
  name: string
  location: string
  status: "online" | "offline" | "warning"
  lastHeartbeat: string
  resolution: string
}

interface CameraStatusProps {
  cameras: Camera[]
}

export function CameraStatus({ cameras }: CameraStatusProps) {
  const getStatusColor = (status: Camera["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 border-green-200"
      case "offline":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-amber-100 text-amber-800 border-amber-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: Camera["status"]) => {
    switch (status) {
      case "online":
        return "●"
      case "offline":
        return "●"
      case "warning":
        return "⚠"
      default:
        return "●"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">Camera Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{camera.name}</span>
                  <Badge variant="outline" className={getStatusColor(camera.status)}>
                    <span className="mr-1">{getStatusIcon(camera.status)}</span>
                    {camera.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>{camera.location}</div>
                  <div className="flex gap-4 mt-1">
                    <span>Last: {camera.lastHeartbeat}</span>
                    <span>{camera.resolution}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
