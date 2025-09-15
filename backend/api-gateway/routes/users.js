const express = require('express');
const router = express.Router();

// Mock user data (replace with database integration)
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    emergencyContacts: [
      { name: 'Jane Doe', phone: '+1234567891', relation: 'Spouse' }
    ],
    verificationStatus: 'verified',
    currentLocation: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
    riskProfile: 'low'
  }
];

// GET /api/users - Get all users (admin only)
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: users.map(user => ({
      ...user,
      // Don't expose sensitive data
      password: undefined
    })),
    count: users.length
  });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: { ...user, password: undefined }
  });
});

// POST /api/users/register - Register new user
router.post('/register', (req, res) => {
  const { name, email, phone, password, emergencyContacts } = req.body;
  
  // Basic validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, phone, and password are required'
    });
  }
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }
  
  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    phone,
    password, // In production, hash this password
    emergencyContacts: emergencyContacts || [],
    verificationStatus: 'pending',
    currentLocation: null,
    riskProfile: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { ...newUser, password: undefined }
  });
});

// POST /api/users/login - User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
  
  // In production, generate JWT token
  const token = 'mock-jwt-token-' + user.id;
  
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { ...user, password: undefined },
      token
    }
  });
});

// PUT /api/users/:id - Update user profile
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const updates = req.body;
  delete updates.id; // Don't allow ID changes
  delete updates.password; // Handle password changes separately
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'User updated successfully',
    data: { ...users[userIndex], password: undefined }
  });
});

// POST /api/users/:id/location - Update user location
router.post('/:id/location', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const { lat, lng, address } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }
  
  users[userIndex].currentLocation = {
    lat,
    lng,
    address: address || 'Unknown location',
    updatedAt: new Date().toISOString()
  };
  users[userIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Location updated successfully',
    data: users[userIndex].currentLocation
  });
});

// POST /api/users/:id/emergency - Trigger emergency alert
router.post('/:id/emergency', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const { type, description } = req.body;
  
  // Create emergency alert
  const alert = {
    id: Date.now().toString(),
    userId: user.id,
    type: type || 'general',
    description: description || 'Emergency assistance needed',
    location: user.currentLocation,
    timestamp: new Date().toISOString(),
    status: 'active'
  };
  
  // In production, trigger notification system
  console.log('🚨 EMERGENCY ALERT:', alert);
  
  res.json({
    success: true,
    message: 'Emergency alert sent successfully',
    data: alert
  });
});

module.exports = router;