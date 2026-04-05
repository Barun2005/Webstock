const mongoose = require('mongoose');

// We organize data for scalability. 
// A standard document schema with indexes. Time-Series schema would be an advanced option.
const eventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: ['page_view', 'click', 'error', 'purchase', 'login'],
      index: true // Indexing this field for fast filtering
    },
    userId: {
      type: String,
      // Optional: anonymous users won't have it
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      description: 'Flexible payload for different event types'
    },
    sourceIp: String,
    userAgent: String,
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// We add a descending index on 'createdAt' to easily query data within recent time ranges
eventSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Event', eventSchema);
