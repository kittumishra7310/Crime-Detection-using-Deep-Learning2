import { type NextRequest, NextResponse } from "next/server"

// Mock history endpoint
export async function GET(request: NextRequest) {
  try {
    // Mock history data
    const mockHistory = [
      {
        id: "1",
        type: "Person Detected",
        severity: "medium",
        timestamp: new Date().toISOString(),
        cameraId: "CAM-001",
        confidence: 0.92,
        description: "Person detected in restricted area during off-hours",
      },
      {
        id: "2",
        type: "Motion Alert",
        severity: "low",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        cameraId: "CAM-002",
        confidence: 0.78,
        description: "Motion detected in parking area",
      },
    ]

    return NextResponse.json(mockHistory)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch history data" }, { status: 500 })
  }
}
