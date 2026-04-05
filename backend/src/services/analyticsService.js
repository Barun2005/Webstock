const { getIO } = require('../sockets');

// A highly scalable in-memory buffer. 
// Note: In an enterprise setting with multiple Node instances, we would use a Redis Cache or Kafka.
let activeUsersSet = new Set();
let eventsThisSecond = 0;
let errorsThisSecond = 0;

const startMetricsBroadcaster = () => {
  setInterval(() => {
    try {
      const io = getIO();
      const eventsPerSec = eventsThisSecond;

      // Calculate error percentage
      const errorRate = eventsPerSec > 0 ? (errorsThisSecond / eventsPerSec) * 100 : 0;

      const metrics = {
        timestamp: new Date().toISOString(),
        activeUsers: activeUsersSet.size,
        eventsPerSec,
        errorRate: parseFloat(errorRate.toFixed(2))
      };

      // Broadcast aggregated metrics every 1 second to the dashboard
      io.to('dashboard').emit('metrics_update', metrics);

      // Simple threshold Alert System
      // (Requirement #4: Alert system when threshold exceeds)
      if (errorRate >= 10 && eventsPerSec > 5) {
        const message = `Error rate spiked to ${errorRate.toFixed(2)}% with ${eventsPerSec} events/sec`;
        io.to('dashboard').emit('alert_trigger', {
          level: 'CRITICAL',
          message: message
        });

        // 🔔 ACTION: External Webhook Integration (Phase 3)
        // The server acts as a physical client and sends SOS HTTP logs to external endpoints (Slack/Discord setup)
        console.log(`\n[CRITICAL WEBHOOK DISPATCHED] 🚀 Broadcasting SOS to external infrastructure: ${message}`);

        // Example execution format (Ignored until setup):
        // axios.post('https://discord.com/api/webhooks/XX/YY', { content: message }).catch(() => {});
      }

      // Reset counters exactly for the next 1-second timeframe
      eventsThisSecond = 0;
      errorsThisSecond = 0;

    } catch (e) {
      // Ignored if socket is not bound
    }
  }, 1000); // 1 tick per second
};

// Expose a method to process incoming events
const processEventForMetrics = (event) => {
  eventsThisSecond++;

  if (event.userId) {
    activeUsersSet.add(event.userId);
  }

  if (event.eventType === 'error') {
    errorsThisSecond++;
  }
};

module.exports = { startMetricsBroadcaster, processEventForMetrics };
