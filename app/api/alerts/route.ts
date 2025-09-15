import { type NextRequest, NextResponse } from "next/server"

// Mock alerts endpoint
export async function GET(request: NextRequest) {
  try {
    // Mock alerts data
    const mockAlerts = [
      {
        id: "1",
        type: "Unauthorized Access",
        severity: "high",
        timestamp: new Date().toISOString(),
        cameraId: "CAM-003",
        status: "active",
        actionTaken: "Security notified",
        description: "Attempted access to secure door without authorization",
      },
      {
        id: "2",
        type: "Motion Alert",
        severity: "medium",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        cameraId: "CAM-002",
        status: "acknowledged",
        actionTaken: "Guard dispatched",
        description: "Motion detected in restricted area after hours",
      },
    ]

    return NextResponse.json(mockAlerts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts data" }, { status: 500 })
  }
}
