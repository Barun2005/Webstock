const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

// Only clients providing valid JWT Headers can successfully ingest pipeline traffic!
router.post('/', protect, eventController.ingestEvent);

module.exports = router;
