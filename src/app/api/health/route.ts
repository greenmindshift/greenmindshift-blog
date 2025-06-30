import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Hier könnten wir zusätzliche Health-Checks hinzufügen
    // z.B. Datenbankverbindung prüfen
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    }

    return NextResponse.json(healthStatus, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 503 }
    )
  }
}

// Unterstütze auch HEAD-Requests für einfache Health-Checks
export async function HEAD() {
  try {
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
} 