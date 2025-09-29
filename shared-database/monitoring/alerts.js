const PerformanceMonitor = require('./performance-monitor');

class AlertSystem {
  constructor(config) {
    this.config = {
      slackWebhook: config.slackWebhook,
      emailEndpoint: config.emailEndpoint,
      alertThresholds: {
        queryTime: 1000, // ms
        errorRate: 0.05, // 5%
        connectionThreshold: 0.8 // 80% of max connections
      },
      ...config
    };
    
    this.monitor = new PerformanceMonitor(
      config.supabaseUrl,
      config.supabaseKey
    );
  }

  async checkAndAlert() {
    try {
      const report = await this.monitor.generateReport();
      const alerts = this.monitor.shouldAlert(report);
      
      if (alerts.length > 0) {
        await this.sendAlerts(alerts, report);
      }
      
      // Log report for monitoring
      console.log('Performance Report:', JSON.stringify(report, null, 2));
      
      return { success: true, alerts: alerts.length, report };
      
    } catch (error) {
      console.error('Alert system error:', error);
      await this.sendCriticalAlert('Alert system failure', error.message);
      return { success: false, error: error.message };
    }
  }

  async sendAlerts(alerts, report) {
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');
    
    // Send critical alerts immediately
    if (criticalAlerts.length > 0) {
      await this.sendSlackAlert('🚨 CRITICAL DATABASE ALERTS', criticalAlerts, report);
      await this.sendEmailAlert('CRITICAL: Database Issues Detected', criticalAlerts, report);
    }
    
    // Send warning alerts (less urgent)
    if (warningAlerts.length > 0) {
      await this.sendSlackAlert('⚠️ Database Performance Warnings', warningAlerts, report);
    }
  }

  async sendSlackAlert(title, alerts, report) {
    if (!this.config.slackWebhook) return;
    
    try {
      const message = {
        text: title,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: title
            }
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Timestamp:* ${report.timestamp}\n*Health Status:* ${report.health.status}`
            }
          }
        ]
      };

      // Add alert details
      alerts.forEach(alert => {
        message.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${alert.type.toUpperCase()}:* ${alert.message}`
          }
        });
      });

      // Add performance metrics
      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Metrics:*\n• Avg Query Time: ${report.metrics.averageQueryTime}ms\n• Slow Queries: ${report.slowQueries.length}\n• Total Errors: ${report.metrics.totalErrors}`
        }
      });

      const response = await fetch(this.config.slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.status}`);
      }

    } catch (error) {
      console.error('Failed to send Slack alert:', error);
    }
  }

  async sendEmailAlert(subject, alerts, report) {
    if (!this.config.emailEndpoint) return;
    
    try {
      const emailBody = `
        <h2>${subject}</h2>
        <p><strong>Timestamp:</strong> ${report.timestamp}</p>
        <p><strong>Database Health:</strong> ${report.health.status}</p>
        
        <h3>Alerts:</h3>
        <ul>
          ${alerts.map(alert => `
            <li>
              <strong>${alert.type.toUpperCase()}:</strong> ${alert.message}
              ${alert.details ? `<br><small>${JSON.stringify(alert.details)}</small>` : ''}
            </li>
          `).join('')}
        </ul>
        
        <h3>Performance Metrics:</h3>
        <ul>
          <li>Average Query Time: ${report.metrics.averageQueryTime}ms</li>
          <li>Slow Queries: ${report.slowQueries.length}</li>
          <li>Total Errors: ${report.metrics.totalErrors}</li>
        </ul>
        
        <h3>Table Sizes:</h3>
        <pre>${JSON.stringify(report.tableSizes, null, 2)}</pre>
      `;

      const response = await fetch(this.config.emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: this.config.alertEmails,
          subject,
          html: emailBody
        })
      });

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`);
      }

    } catch (error) {
      console.error('Failed to send email alert:', error);
    }
  }

  async sendCriticalAlert(title, message) {
    const criticalAlert = {
      text: `🚨 CRITICAL: ${title}`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 CRITICAL: ${title}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Error:* ${message}\n*Time:* ${new Date().toISOString()}`
          }
        }
      ]
    };

    if (this.config.slackWebhook) {
      try {
        await fetch(this.config.slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(criticalAlert)
        });
      } catch (error) {
        console.error('Failed to send critical Slack alert:', error);
      }
    }
  }

  // Start continuous monitoring
  startMonitoring(intervalMinutes = 5) {
    console.log(`Starting database monitoring every ${intervalMinutes} minutes...`);
    
    // Initial check
    this.checkAndAlert();
    
    // Set up interval
    setInterval(() => {
      this.checkAndAlert();
    }, intervalMinutes * 60 * 1000);
  }
}

module.exports = AlertSystem;
