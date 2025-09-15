const express = require('express');
const router = express.Router();

// Mock blockchain data
let identities = [];

// GET /api/blockchain/identity/:id - Get digital identity
router.get('/identity/:id', (req, res) => {
  const identity = identities.find(id => id.userId === req.params.id);
  if (!identity) {
    return res.status(404).json({ success: false, message: 'Identity not found' });
  }
  res.json({ success: true, data: identity });
});

// POST /api/blockchain/identity - Create digital identity
router.post('/identity', (req, res) => {
  const identity = {
    id: Date.now().toString(),
    userId: req.body.userId,
    verified: false,
    hash: 'mock-blockchain-hash-' + Date.now(),
    timestamp: new Date().toISOString()
  };
  identities.push(identity);
  res.status(201).json({ success: true, data: identity });
});

// POST /api/blockchain/verify - Verify identity
router.post('/verify', (req, res) => {
  const { userId } = req.body;
  const identity = identities.find(id => id.userId === userId);
  if (identity) {
    identity.verified = true;
    identity.verifiedAt = new Date().toISOString();
  }
  res.json({ success: true, verified: !!identity?.verified });
});

module.exports = router;