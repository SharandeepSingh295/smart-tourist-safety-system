const express = require('express');
const router = express.Router();

// Mock location data
let locations = [
  {
    id: '1',
    name: 'Times Square',
    type: 'tourist_attraction',
    coordinates: { lat: 40.758, lng: -73.9855 },
    address: 'Times Square, New York, NY 10036',
    safetyRating: 3,
    riskFactors: ['crowded', 'pickpockets'],
    geofence: {
      radius: 500, // meters
      alertTypes: ['entry', 'exit']
    },
    emergencyServices: [
      { type: 'police', distance: 200, contact: '911' },
      { type: 'medical', distance: 300, contact: '911' }
    ],
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Central Park',
    type: 'park',
    coordinates: { lat: 40.7829, lng: -73.9654 },
    address: 'Central Park, New York, NY',
    safetyRating: 4,
    riskFactors: ['isolated_areas_at_night'],
    geofence: {
      radius: 1000,
      alertTypes: ['entry']
    },
    emergencyServices: [
      { type: 'police', distance: 150, contact: '911' },
      { type: 'medical', distance: 400, contact: '911' }
    ],
    lastUpdated: new Date().toISOString()
  }
];

let geofences = [];

// GET /api/locations - Get all locations with optional filtering
router.get('/', (req, res) => {
  const { type, lat, lng, radius } = req.query;
  let filteredLocations = [...locations];
  
  // Filter by type
  if (type) {
    filteredLocations = filteredLocations.filter(loc => loc.type === type);
  }
  
  // Filter by proximity if coordinates provided
  if (lat && lng && radius) {
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const searchRadius = parseFloat(radius);
    
    filteredLocations = filteredLocations.filter(loc => {
      const distance = calculateDistance(
        userLat, userLng,
        loc.coordinates.lat, loc.coordinates.lng
      );
      return distance <= searchRadius;
    });
  }
  
  res.json({
    success: true,
    data: filteredLocations,
    count: filteredLocations.length,
    filters: { type, lat, lng, radius }
  });
});

// GET /api/locations/:id - Get specific location
router.get('/:id', (req, res) => {
  const location = locations.find(loc => loc.id === req.params.id);
  if (!location) {
    return res.status(404).json({
      success: false,
      message: 'Location not found'
    });
  }
  
  res.json({
    success: true,
    data: location
  });
});

// POST /api/locations/nearby - Get nearby locations and risks
router.post('/nearby', (req, res) => {
  const { lat, lng, radius = 1000 } = req.body;
  
  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }
  
  const nearbyLocations = locations.filter(loc => {
    const distance = calculateDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng);
    return distance <= radius;
  });
  
  // Calculate overall risk assessment
  const riskAssessment = calculateRiskAssessment(nearbyLocations, lat, lng);
  
  res.json({
    success: true,
    data: {
      locations: nearbyLocations,
      riskAssessment,
      searchRadius: radius,
      count: nearbyLocations.length
    }
  });
});

// POST /api/locations/geofence/check - Check if user is in any geofenced areas
router.post('/geofence/check', (req, res) => {
  const { lat, lng, userId } = req.body;
  
  if (!lat || !lng || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Latitude, longitude, and userId are required'
    });
  }
  
  const triggeredGeofences = [];
  
  locations.forEach(location => {
    if (location.geofence) {
      const distance = calculateDistance(lat, lng, location.coordinates.lat, location.coordinates.lng);
      if (distance <= location.geofence.radius) {
        triggeredGeofences.push({
          locationId: location.id,
          locationName: location.name,
          type: 'entry',
          distance,
          alertTypes: location.geofence.alertTypes,
          safetyRating: location.safetyRating,
          riskFactors: location.riskFactors
        });
      }
    }
  });
  
  res.json({
    success: true,
    data: {
      triggeredGeofences,
      userLocation: { lat, lng },
      count: triggeredGeofences.length
    }
  });
});

// POST /api/locations/safety-report - Report safety incident at location
router.post('/safety-report', (req, res) => {
  const { locationId, userId, incidentType, description, severity, coordinates } = req.body;
  
  const report = {
    id: Date.now().toString(),
    locationId,
    userId,
    incidentType: incidentType || 'other',
    description,
    severity: severity || 'medium',
    coordinates: coordinates || null,
    timestamp: new Date().toISOString(),
    status: 'pending',
    verified: false
  };
  
  // Update location safety rating based on report
  if (locationId) {
    const location = locations.find(loc => loc.id === locationId);
    if (location && severity === 'high') {
      location.safetyRating = Math.max(1, location.safetyRating - 0.5);
      location.lastUpdated = new Date().toISOString();
    }
  }
  
  console.log('📍 New safety report:', report);
  
  res.status(201).json({
    success: true,
    message: 'Safety report submitted successfully',
    data: report
  });
});

// PUT /api/locations/:id/safety-rating - Update location safety rating
router.put('/:id/safety-rating', (req, res) => {
  const locationIndex = locations.findIndex(loc => loc.id === req.params.id);
  if (locationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Location not found'
    });
  }
  
  const { rating, riskFactors } = req.body;
  
  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Safety rating must be between 1 and 5'
    });
  }
  
  locations[locationIndex].safetyRating = rating;
  if (riskFactors) {
    locations[locationIndex].riskFactors = riskFactors;
  }
  locations[locationIndex].lastUpdated = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Location safety rating updated successfully',
    data: locations[locationIndex]
  });
});

// Helper functions
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function calculateRiskAssessment(locations, userLat, userLng) {
  if (locations.length === 0) {
    return {
      level: 'unknown',
      score: 0,
      factors: [],
      recommendations: ['Stay aware of your surroundings']
    };
  }
  
  const avgSafetyRating = locations.reduce((sum, loc) => sum + loc.safetyRating, 0) / locations.length;
  const allRiskFactors = [...new Set(locations.flatMap(loc => loc.riskFactors))];
  
  let riskLevel = 'low';
  let riskScore = (5 - avgSafetyRating) * 20; // Convert 1-5 scale to 0-80
  
  if (riskScore >= 60) riskLevel = 'high';
  else if (riskScore >= 40) riskLevel = 'medium';
  
  const recommendations = generateRecommendations(riskLevel, allRiskFactors);
  
  return {
    level: riskLevel,
    score: Math.round(riskScore),
    factors: allRiskFactors,
    avgSafetyRating: Math.round(avgSafetyRating * 10) / 10,
    recommendations
  };
}

function generateRecommendations(riskLevel, riskFactors) {
  const baseRecommendations = ['Stay aware of your surroundings', 'Keep emergency contacts handy'];
  
  if (riskLevel === 'high') {
    baseRecommendations.push('Consider avoiding this area', 'Travel with others if possible');
  }
  
  if (riskFactors.includes('crowded')) {
    baseRecommendations.push('Watch for pickpockets', 'Keep valuables secure');
  }
  
  if (riskFactors.includes('isolated_areas_at_night')) {
    baseRecommendations.push('Avoid isolated areas after dark', 'Use well-lit paths');
  }
  
  return [...new Set(baseRecommendations)];
}

module.exports = router;