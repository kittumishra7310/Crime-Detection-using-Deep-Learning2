import { type NextRequest, NextResponse } from "next/server"

// Mock live detection endpoint
export async function GET(request: NextRequest) {
  try {
    // Mock live detection data
    const mockData = {
      status: "active",
      detections: [
        {
          id: Date.now().toString(),
          type: "Person Detected",
          severity: "medium",
          timestamp: new Date().toISOString(),
          cameraId: "CAM-001",
          confidence: 0.92,
        },
      ],
      stats: {
        totalDetections: 247,
        alertsTriggered: 12,
        uptime: "24h 15m",
        activeCameras: 8,
      },
    }

    return NextResponse.json(mockData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch live detection data" }, { status: 500 })
  }
}
