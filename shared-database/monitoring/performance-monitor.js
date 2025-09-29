const { createClient } = require('@supabase/supabase-js');

class PerformanceMonitor {
  constructor(supabaseUrl, supabaseKey) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.metrics = {
      queryTimes: [],
      connectionCount: 0,
      errorRate: 0,
      lastCheck: null
    };
  }

  async checkDatabaseHealth() {
    const startTime = Date.now();
    
    try {
      // Test basic connectivity
      const { data: healthCheck, error } = await this.supabase
        .from('services')
        .select('count(*)')
        .limit(1)
        .single();

      if (error) throw error;

      const queryTime = Date.now() - startTime;
      this.metrics.queryTimes.push(queryTime);
      
      // Keep only last 100 measurements
      if (this.metrics.queryTimes.length > 100) {
        this.metrics.queryTimes.shift();
      }

      return {
        status: 'healthy',
        queryTime,
        avgQueryTime: this.getAverageQueryTime(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.metrics.errorRate++;
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async checkConnectionPool() {
    try {
      // This requires elevated permissions - may not work with anon key
      const { data, error } = await this.supabase
        .rpc('get_connection_count');

      if (error) {
        // Fallback: estimate based on active queries
        return {
          estimated: true,
          message: 'Cannot access connection pool directly'
        };
      }

      return {
        activeConnections: data,
        estimated: false
      };

    } catch (error) {
      return {
        error: error.message,
        estimated: true
      };
    }
  }

  async checkTableSizes() {
    try {
      const tables = ['appointments', 'user_profiles', 'services', 'testimonials'];
      const sizes = {};

      for (const table of tables) {
        const { count, error } = await this.supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          sizes[table] = count;
        }
      }

      return sizes;
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkSlowQueries() {
    const slowQueries = [];
    
    // Test common queries and measure performance
    const testQueries = [
      {
        name: 'appointments_by_status',
        query: () => this.supabase
          .from('appointments')
          .select('*')
          .eq('status', 'pending')
          .limit(10)
      },
      {
        name: 'user_profiles_recent',
        query: () => this.supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
      },
      {
        name: 'services_active',
        query: () => this.supabase
          .from('services')
          .select('*')
          .eq('is_active', true)
      }
    ];

    for (const test of testQueries) {
      const startTime = Date.now();
      try {
        await test.query();
        const duration = Date.now() - startTime;
        
        if (duration > 1000) { // Queries taking more than 1 second
          slowQueries.push({
            name: test.name,
            duration,
            threshold: 1000
          });
        }
      } catch (error) {
        slowQueries.push({
          name: test.name,
          error: error.message
        });
      }
    }

    return slowQueries;
  }

  getAverageQueryTime() {
    if (this.metrics.queryTimes.length === 0) return 0;
    const sum = this.metrics.queryTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.metrics.queryTimes.length);
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      health: await this.checkDatabaseHealth(),
      connections: await this.checkConnectionPool(),
      tableSizes: await this.checkTableSizes(),
      slowQueries: await this.checkSlowQueries(),
      metrics: {
        averageQueryTime: this.getAverageQueryTime(),
        totalErrors: this.metrics.errorRate,
        recentQueryTimes: this.metrics.queryTimes.slice(-10)
      }
    };

    return report;
  }

  // Alert thresholds
  shouldAlert(report) {
    const alerts = [];

    // Slow query alert
    if (report.metrics.averageQueryTime > 500) {
      alerts.push({
        type: 'performance',
        severity: 'warning',
        message: `Average query time is ${report.metrics.averageQueryTime}ms (threshold: 500ms)`
      });
    }

    // Slow queries alert
    if (report.slowQueries.length > 0) {
      alerts.push({
        type: 'slow_queries',
        severity: 'warning',
        message: `${report.slowQueries.length} slow queries detected`,
        details: report.slowQueries
      });
    }

    // Health check alert
    if (report.health.status === 'unhealthy') {
      alerts.push({
        type: 'health',
        severity: 'critical',
        message: 'Database health check failed',
        error: report.health.error
      });
    }

    return alerts;
  }
}

module.exports = PerformanceMonitor;
