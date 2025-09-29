import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Check environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    const missingEnvVars = requiredEnvVars.filter(
      envVar => !process.env[envVar] || process.env[envVar] === 'your_supabase_project_url'
    );
    
    if (missingEnvVars.length > 0) {
      return NextResponse.json({
        status: 'unhealthy',
        message: 'Missing environment variables',
        missing: missingEnvVars,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      }, { status: 503 });
    }

    // Test database connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const dbStartTime = Date.now();
    const { data, error } = await supabase
      .from('services')
      .select('count(*)')
      .limit(1)
      .single();
    
    const dbResponseTime = Date.now() - dbStartTime;

    if (error) {
      return NextResponse.json({
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      }, { status: 503 });
    }

    // All checks passed
    return NextResponse.json({
      status: 'healthy',
      message: 'Patient-facing application is running normally',
      checks: {
        environment: 'ok',
        database: 'ok',
        dbResponseTime: `${dbResponseTime}ms`
      },
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      version: process.env.npm_package_version || '1.0.0'
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`
    }, { status: 503 });
  }
}
