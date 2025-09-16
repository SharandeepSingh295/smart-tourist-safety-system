const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.vercel.app'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname), {
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
    etag: true
}));

// API Routes (for future expansion)
app.use('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Smart Tourist Safety Web App is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
    // If the request is for an API endpoint, return 404
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            error: 'API endpoint not found',
            path: req.path
        });
    }
    // Otherwise, serve the main HTML file
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
    });
});

// Start server (only if not in serverless environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🌐 Smart Tourist Safety Website running on:`);
        console.log(`   Local:   http://localhost:${PORT}`);
        console.log(`   Network: http://localhost:${PORT}`);
        console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`\n🔗 Open your browser and visit the website!`);
    });
}

module.exports = app;
