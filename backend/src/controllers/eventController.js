const Event = require('../models/Event');
const analyticsService = require('../services/analyticsService');

exports.ingestEvent = async (req, res, next) => {
  try {
    const { eventType, userId, payload } = req.body;
    
    // 1. Create and Save event to Database permanently
    const newEvent = await Event.create({
      eventType,
      userId,
      payload,
      sourceIp: req.ip,
      userAgent: req.headers['user-agent']
    });

    // 2. Feed the event into our Real-Time Aggregator 
    analyticsService.processEventForMetrics(newEvent);

    return res.status(201).json({
      success: true,
      message: 'Event logged successfully'
    });

  } catch (err) {
    // If Mongoose Schema validation fails (e.g. unknown eventType) -> return 400 Bad Request
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    // Otherwise it passes to our main Express Error Handler -> 500 Server Error
    next(err);
  }
};
