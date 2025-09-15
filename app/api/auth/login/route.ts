import { type NextRequest, NextResponse } from "next/server"

// Mock authentication endpoint
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Mock authentication logic - replace with actual authentication
    if (username === "admin" && password === "admin123") {
      return NextResponse.json({
        token: "mock-jwt-token-" + Date.now(),
        user: {
          id: "1",
          username: "admin",
          role: "administrator",
        },
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
