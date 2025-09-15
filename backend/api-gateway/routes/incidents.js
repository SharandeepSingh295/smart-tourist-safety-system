const express = require('express');
const router = express.Router();

let incidents = [];

// GET /api/incidents - Get all incidents
router.get('/', (req, res) => {
  res.json({ success: true, data: incidents });
});

// POST /api/incidents - Create new incident
router.post('/', (req, res) => {
  const incident = {
    id: Date.now().toString(),
    ...req.body,
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  incidents.push(incident);
  res.status(201).json({ success: true, data: incident });
});

module.exports = router;