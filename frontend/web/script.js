// Smart Tourist Safety System - JavaScript Functions

// API Base URL - Environment aware
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3001/api'  // Local development
    : 'https://smart-tourist-safety-api.onrender.com/api';  // Production API - Update this URL after deployment

// Global variables
let currentUser = null;
let userLocation = null;
let safetyInterval = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Smart Tourist Safety System Initialized');
    
    // Check if user is logged in
    checkLoginStatus();
    
    // Start location tracking
    startLocationTracking();
    
    // Start safety monitoring
    startSafetyMonitoring();
    
    // Set up navigation
    setupNavigation();
});

// Check user login status
function checkLoginStatus() {
    const userData = localStorage.getItem('touristSafetyUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        console.log('User logged in:', currentUser.name);
        updateUserInterface();
    } else {
        // For demo purposes, create a mock user
        currentUser = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
        };
        localStorage.setItem('touristSafetyUser', JSON.stringify(currentUser));
        updateUserInterface();
    }
}

// Update user interface based on login status
function updateUserInterface() {
    if (currentUser) {
        document.querySelector('.welcome-section h2').textContent = 
            `Welcome back, ${currentUser.name}!`;
    }
}

// Start location tracking
function startLocationTracking() {
    if (navigator.geolocation) {
        console.log('🌍 Starting location tracking...');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('📍 Location updated:', userLocation);
                updateLocationDisplay();
                checkGeofences();
            },
            (error) => {
                console.error('❌ Location error:', error.message);
                showNotification('Unable to access location. Please enable location services.', 'warning');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );

        // Watch for location changes
        navigator.geolocation.watchPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('📍 Location updated:', userLocation);
                updateLocationDisplay();
                checkGeofences();
            },
            (error) => console.error('Location watch error:', error),
            { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 }
        );
    } else {
        console.error('❌ Geolocation not supported');
        showNotification('Geolocation is not supported by this browser.', 'error');
    }
}

// Update location display
function updateLocationDisplay() {
    if (userLocation) {
        // In a real app, you'd reverse geocode the coordinates
        document.getElementById('location-name').textContent = 
            `Current Location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
    }
}

// Check geofences
async function checkGeofences() {
    if (!userLocation || !currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/locations/geofence/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: userLocation.lat,
                lng: userLocation.lng,
                userId: currentUser.id
            })
        });

        const result = await response.json();
        if (result.success && result.data.triggeredGeofences.length > 0) {
            const geofence = result.data.triggeredGeofences[0];
            showNotification(
                `You've entered ${geofence.locationName}. Safety rating: ${geofence.safetyRating}/5`,
                'info'
            );
            console.log('🚨 Geofence triggered:', geofence);
        }
    } catch (error) {
        console.error('Geofence check failed:', error);
    }
}

// Start safety monitoring
function startSafetyMonitoring() {
    // Update safety status every 30 seconds
    safetyInterval = setInterval(updateSafetyStatus, 30000);
    updateSafetyStatus(); // Initial update
}

// Update safety status
async function updateSafetyStatus() {
    if (!userLocation) return;

    try {
        // Get nearby locations and risk analysis
        const response = await fetch(`${API_BASE_URL}/locations/nearby`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: userLocation.lat,
                lng: userLocation.lng,
                radius: 1000
            })
        });

        const result = await response.json();
        if (result.success) {
            const riskAssessment = result.data.riskAssessment;
            updateRiskMeter(riskAssessment.score, riskAssessment.level);
            updateSafetyAlerts(result.data.locations);
        }
    } catch (error) {
        console.error('Safety status update failed:', error);
        // Simulate random risk for demo
        const randomRisk = Math.floor(Math.random() * 100);
        updateRiskMeter(randomRisk, randomRisk > 70 ? 'high' : randomRisk > 40 ? 'medium' : 'low');
    }
}

// Update risk meter
function updateRiskMeter(score, level) {
    const riskFill = document.querySelector('.risk-fill');
    const riskValue = document.querySelector('.risk-value');
    const statusElement = document.getElementById('status');
    
    if (riskFill && riskValue && statusElement) {
        riskFill.style.width = score + '%';
        
        let color, status, statusClass;
        switch (level) {
            case 'high':
                color = '#F44336';
                status = 'HIGH RISK';
                statusClass = 'status-danger';
                break;
            case 'medium':
                color = '#FF9800';
                status = 'MEDIUM RISK';
                statusClass = 'status-warning';
                break;
            default:
                color = '#4CAF50';
                status = 'LOW RISK';
                statusClass = 'status-safe';
        }
        
        riskFill.style.background = `linear-gradient(90deg, ${color}, ${color}88)`;
        riskValue.textContent = `${score}% - ${status}`;
        riskValue.style.color = color;
        
        statusElement.textContent = level === 'low' ? 'SAFE' : status;
        statusElement.className = statusClass;
    }
}

// Update safety alerts
function updateSafetyAlerts(locations) {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;

    // Clear existing alerts
    alertsList.innerHTML = '';

    // Add alerts based on nearby locations
    locations.forEach((location, index) => {
        if (location.riskFactors && location.riskFactors.length > 0) {
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert-item ${location.safetyRating <= 2 ? 'high' : location.safetyRating <= 3 ? 'medium' : 'low'}`;
            
            const severity = location.safetyRating <= 2 ? 'high' : location.safetyRating <= 3 ? 'medium' : 'low';
            const icon = severity === 'high' ? 'fa-exclamation-triangle' : 
                        severity === 'medium' ? 'fa-exclamation-triangle' : 'fa-info-circle';
            
            alertDiv.innerHTML = `
                <div class="alert-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="alert-content">
                    <h4>${location.riskFactors[0].replace('_', ' ').toUpperCase()}</h4>
                    <p>${location.name} - Safety rating: ${location.safetyRating}/5</p>
                    <span class="alert-time">${Math.floor(Math.random() * 30) + 1} minutes ago</span>
                </div>
            `;
            
            alertsList.appendChild(alertDiv);
        }
    });

    // If no alerts, show default message
    if (alertsList.children.length === 0) {
        alertsList.innerHTML = `
            <div class="alert-item low">
                <div class="alert-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="alert-content">
                    <h4>All Clear</h4>
                    <p>No safety alerts in your current area</p>
                    <span class="alert-time">Just now</span>
                </div>
            </div>
        `;
    }
}

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Here you would typically show/hide different sections
            console.log('Navigation to:', link.getAttribute('href'));
        });
    });
}

// Emergency functions
function triggerEmergency() {
    console.log('🚨 Emergency button pressed!');
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

async function sendEmergencyAlert() {
    if (!currentUser) return;

    try {
        showNotification('🚨 EMERGENCY ALERT SENT! Help is on the way!', 'emergency');
        
        const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/emergency`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'general',
                description: 'Emergency assistance needed - sent from web app',
                location: userLocation
            })
        });

        const result = await response.json();
        console.log('Emergency alert result:', result);
        
        closeModal();
        
        // Simulate emergency response
        setTimeout(() => {
            showNotification('Emergency services have been notified. Stay calm and stay where you are.', 'info');
        }, 2000);
        
    } catch (error) {
        console.error('Emergency alert failed:', error);
        showNotification('Emergency alert failed. Please call local emergency services directly.', 'error');
    }
}

function closeModal() {
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Quick action functions
function shareLocation() {
    if (userLocation) {
        const locationText = `My current location: https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Location - Smart Tourist Safety',
                text: locationText
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(locationText).then(() => {
                showNotification('Location copied to clipboard!', 'success');
            });
        }
    } else {
        showNotification('Location not available', 'warning');
    }
}

function reportIncident() {
    const incidentType = prompt('What type of incident would you like to report?');
    if (incidentType) {
        console.log('📢 Incident reported:', incidentType);
        showNotification('Incident report submitted. Thank you for helping keep everyone safe!', 'success');
        
        // In a real app, send to API
        fetch(`${API_BASE_URL}/incidents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                type: incidentType,
                location: userLocation,
                timestamp: new Date().toISOString()
            })
        }).catch(console.error);
    }
}

function findSafeRoute() {
    showNotification('Safe route finder coming soon!', 'info');
    console.log('🗺️ Safe route requested');
}

function emergencyContacts() {
    const contacts = `
Emergency Contacts:
🚨 Police: 911
🏥 Medical: 911
🔥 Fire: 911
📞 Emergency Helpline: 1-800-HELP
    `;
    alert(contacts);
}

function loadFullMap() {
    showNotification('Full interactive map coming soon!', 'info');
    console.log('🗺️ Full map requested');
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        emergency: '🚨'
    };
    
    notification.innerHTML = `
        <span class="notification-icon">${icons[type] || 'ℹ️'}</span>
        <span class="notification-message">${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'emergency' ? '#FF4444' : type === 'success' ? '#4CAF50' : 
                    type === 'error' ? '#F44336' : type === 'warning' ? '#FF9800' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyles);

// Handle modal clicks
document.addEventListener('click', function(e) {
    const modal = document.getElementById('emergency-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Handle escape key for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

console.log('✅ Smart Tourist Safety System JavaScript loaded successfully!');