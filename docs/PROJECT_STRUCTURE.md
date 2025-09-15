# Smart Tourist Safety System - Project Structure

This document provides a comprehensive overview of the project structure and organization.

## Root Directory Structure

```
smart-tourist-safety-system/
├── README.md                    # Main project documentation
├── package.json                 # Root package configuration
├── .gitignore                   # Git ignore rules
├── docker-compose.yml           # Development environment setup
├── LICENSE                      # Project license
├── .env.example                 # Environment variables template
│
├── frontend/                    # Client-side applications
├── backend/                     # Server-side services
├── blockchain/                  # Blockchain and smart contracts
├── ai-modules/                  # AI/ML components
├── config/                      # Configuration files
├── docs/                        # Documentation
├── tests/                       # Test suites
└── scripts/                     # Utility scripts
```

## Detailed Directory Breakdown

### `/frontend` - Client-Side Applications

```
frontend/
├── tourist-app/                 # React Native mobile application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── common/          # Common components (buttons, inputs, etc.)
│   │   │   ├── maps/            # Map-related components
│   │   │   ├── safety/          # Safety-specific components
│   │   │   └── auth/            # Authentication components
│   │   ├── screens/             # Application screens
│   │   │   ├── auth/            # Login, register, etc.
│   │   │   ├── dashboard/       # Main dashboard
│   │   │   ├── safety/          # Safety monitoring screens
│   │   │   ├── emergency/       # Emergency-related screens
│   │   │   ├── profile/         # User profile screens
│   │   │   └── settings/        # App settings
│   │   ├── navigation/          # Navigation configuration
│   │   ├── services/            # API and external services
│   │   ├── store/               # Redux store configuration
│   │   ├── utils/               # Utility functions
│   │   └── constants/           # App constants
│   ├── android/                 # Android-specific files
│   ├── ios/                     # iOS-specific files
│   ├── assets/                  # Images, fonts, etc.
│   └── package.json             # Mobile app dependencies
│
└── admin-dashboard/             # React.js web dashboard
    ├── src/
    │   ├── components/          # Dashboard components
    │   │   ├── layout/          # Layout components
    │   │   ├── charts/          # Data visualization
    │   │   ├── tables/          # Data tables
    │   │   └── forms/           # Form components
    │   ├── pages/               # Dashboard pages
    │   │   ├── dashboard/       # Main dashboard
    │   │   ├── tourists/        # Tourist management
    │   │   ├── incidents/       # Incident monitoring
    │   │   ├── analytics/       # Analytics and reports
    │   │   ├── zones/           # Safe zone management
    │   │   └── settings/        # System settings
    │   ├── hooks/               # Custom React hooks
    │   ├── context/             # React context providers
    │   ├── services/            # API services
    │   └── utils/               # Utility functions
    ├── public/                  # Static assets
    └── package.json             # Dashboard dependencies
```

### `/backend` - Server-Side Services

```
backend/
├── api-gateway/                 # Main API gateway service
│   ├── src/
│   │   ├── routes/              # API route definitions
│   │   ├── middleware/          # Express middleware
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utility functions
│   │   └── config/              # Service configuration
│   ├── tests/                   # Unit and integration tests
│   ├── Dockerfile               # Container configuration
│   └── package.json             # Service dependencies
│
├── auth-service/                # Authentication microservice
│   ├── src/
│   │   ├── models/              # User models
│   │   ├── routes/              # Auth routes
│   │   ├── controllers/         # Auth controllers
│   │   ├── middleware/          # Auth middleware
│   │   ├── services/            # Auth business logic
│   │   └── utils/               # JWT, validation utils
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── notification/                # Notification service
│   ├── src/
│   │   ├── channels/            # Different notification channels
│   │   │   ├── email/           # Email notifications
│   │   │   ├── sms/             # SMS notifications
│   │   │   ├── push/            # Push notifications
│   │   │   └── websocket/       # Real-time notifications
│   │   ├── templates/           # Message templates
│   │   ├── queue/               # Message queue handlers
│   │   └── services/            # Notification logic
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
└── geo-service/                 # Geolocation service
    ├── src/
    │   ├── models/              # Location models
    │   ├── controllers/         # Geo controllers
    │   ├── services/            # Geofencing logic
    │   ├── utils/               # Geo calculations
    │   └── algorithms/          # Geofencing algorithms
    ├── tests/
    ├── Dockerfile
    └── package.json
```

### `/blockchain` - Blockchain Integration

```
blockchain/
├── contracts/                   # Smart contracts
│   ├── identity/                # Digital identity contracts
│   │   ├── DigitalID.sol        # Main identity contract
│   │   ├── IDRegistry.sol       # Identity registry
│   │   └── AccessControl.sol    # Access control
│   ├── safety/                  # Safety-related contracts
│   │   ├── SafetyMonitor.sol    # Safety monitoring
│   │   ├── IncidentReport.sol   # Incident reporting
│   │   └── EmergencyResponse.sol # Emergency response
│   └── governance/              # Governance contracts
│       ├── Governor.sol         # Governance contract
│       └── Timelock.sol         # Timelock contract
│
├── scripts/                     # Deployment scripts
│   ├── deploy.js                # Main deployment script
│   ├── setup.js                 # Initial setup
│   └── migrate.js               # Migration scripts
│
├── test/                        # Contract tests
│   ├── identity/                # Identity contract tests
│   ├── safety/                  # Safety contract tests
│   └── integration/             # Integration tests
│
├── tasks/                       # Hardhat tasks
├── typechain/                   # Generated TypeScript bindings
├── hardhat.config.js            # Hardhat configuration
└── package.json                 # Blockchain dependencies
```

### `/ai-modules` - AI/ML Components

```
ai-modules/
├── geo-fencing/                 # Geofencing algorithms
│   ├── algorithms/              # Core algorithms
│   │   ├── boundary_detection.py
│   │   ├── zone_validation.py
│   │   └── risk_assessment.py
│   ├── models/                  # ML models
│   └── utils/                   # Utility functions
│
├── incident-detection/          # Incident detection ML
│   ├── models/                  # Trained models
│   │   ├── anomaly_detection/   # Anomaly detection models
│   │   ├── classification/      # Incident classification
│   │   └── prediction/          # Predictive models
│   ├── training/                # Training scripts
│   ├── preprocessing/           # Data preprocessing
│   └── evaluation/              # Model evaluation
│
├── risk-assessment/             # Risk assessment AI
│   ├── models/                  # Risk models
│   ├── features/                # Feature engineering
│   ├── scoring/                 # Risk scoring algorithms
│   └── visualization/           # Risk visualization
│
├── computer-vision/             # Image/video analysis
│   ├── models/                  # CV models
│   ├── detection/               # Object detection
│   ├── recognition/             # Face/person recognition
│   └── tracking/                # Movement tracking
│
├── nlp/                         # Natural Language Processing
│   ├── models/                  # NLP models
│   ├── sentiment/               # Sentiment analysis
│   ├── classification/          # Text classification
│   └── extraction/              # Information extraction
│
├── api/                         # ML API server
│   ├── app.py                   # Main Flask application
│   ├── routes/                  # API routes
│   ├── services/                # ML services
│   └── utils/                   # API utilities
│
├── data/                        # Training data
│   ├── raw/                     # Raw datasets
│   ├── processed/               # Processed datasets
│   └── synthetic/               # Synthetic data
│
├── notebooks/                   # Jupyter notebooks
│   ├── exploration/             # Data exploration
│   ├── training/                # Model training
│   └── evaluation/              # Model evaluation
│
├── requirements.txt             # Python dependencies
├── Dockerfile                   # Container configuration
└── setup.py                     # Package setup
```

### `/config` - Configuration Files

```
config/
├── .env.example                 # Environment template
├── database/                    # Database configurations
│   ├── postgres.js              # PostgreSQL config
│   ├── mongodb.js               # MongoDB config
│   └── migrations/              # Database migrations
├── redis/                       # Redis configurations
├── nginx/                       # Nginx configurations
├── ssl/                         # SSL certificates
└── monitoring/                  # Monitoring configurations
    ├── prometheus.yml           # Prometheus config
    ├── grafana/                 # Grafana dashboards
    └── alerts/                  # Alert rules
```

### `/docs` - Documentation

```
docs/
├── PROJECT_STRUCTURE.md         # This file
├── API_DOCUMENTATION.md         # API documentation
├── DEPLOYMENT.md                # Deployment guide
├── DEVELOPMENT.md               # Development guide
├── ARCHITECTURE.md              # System architecture
├── SECURITY.md                  # Security guidelines
├── CONTRIBUTING.md              # Contribution guide
├── CHANGELOG.md                 # Version changelog
│
├── api/                         # API documentation
│   ├── openapi.yml              # OpenAPI specification
│   └── postman/                 # Postman collections
│
├── design/                      # Design documents
│   ├── system-design.md         # System design
│   ├── database-schema.md       # Database design
│   └── ui-ux/                   # UI/UX documentation
│
├── tutorials/                   # Tutorials and guides
│   ├── getting-started.md       # Getting started guide
│   ├── mobile-app-setup.md      # Mobile app setup
│   └── blockchain-integration.md # Blockchain guide
│
└── assets/                      # Documentation assets
    ├── images/                  # Diagrams and screenshots
    ├── videos/                  # Demo videos
    └── presentations/           # Presentation files
```

### `/tests` - Test Suites

```
tests/
├── unit/                        # Unit tests
│   ├── backend/                 # Backend unit tests
│   ├── frontend/                # Frontend unit tests
│   └── blockchain/              # Smart contract tests
│
├── integration/                 # Integration tests
│   ├── api/                     # API integration tests
│   ├── database/                # Database tests
│   └── services/                # Service integration tests
│
├── e2e/                         # End-to-end tests
│   ├── mobile/                  # Mobile app E2E tests
│   ├── web/                     # Web app E2E tests
│   └── scenarios/               # Test scenarios
│
├── performance/                 # Performance tests
│   ├── load/                    # Load testing
│   ├── stress/                  # Stress testing
│   └── benchmarks/              # Benchmark tests
│
├── security/                    # Security tests
│   ├── penetration/             # Penetration tests
│   ├── vulnerability/           # Vulnerability scans
│   └── compliance/              # Compliance tests
│
├── fixtures/                    # Test data fixtures
├── helpers/                     # Test helper functions
└── config/                      # Test configurations
```

### `/scripts` - Utility Scripts

```
scripts/
├── setup/                       # Setup scripts
│   ├── install.sh               # Installation script
│   ├── database-setup.sh        # Database setup
│   └── environment-setup.sh     # Environment setup
│
├── deployment/                  # Deployment scripts
│   ├── deploy.sh                # Main deployment script
│   ├── staging.sh               # Staging deployment
│   ├── production.sh            # Production deployment
│   └── rollback.sh              # Rollback script
│
├── maintenance/                 # Maintenance scripts
│   ├── backup.sh                # Backup script
│   ├── cleanup.sh               # Cleanup script
│   └── health-check.sh          # Health check script
│
├── data/                        # Data scripts
│   ├── seed.js                  # Database seeding
│   ├── migrate.js               # Data migration
│   └── import.js                # Data import
│
└── build/                       # Build scripts
    ├── build-all.sh             # Build all components
    ├── build-mobile.sh          # Mobile app build
    └── build-docker.sh          # Docker image build
```

## File Naming Conventions

### General Rules
- Use kebab-case for file names: `user-profile.js`
- Use PascalCase for React components: `UserProfile.jsx`
- Use camelCase for JavaScript variables and functions
- Use UPPER_SNAKE_CASE for constants: `API_BASE_URL`

### Backend Services
- Controllers: `userController.js`
- Models: `User.js`
- Routes: `userRoutes.js`
- Services: `userService.js`
- Middleware: `authMiddleware.js`

### Frontend Components
- React components: `UserProfile.jsx`
- Hooks: `useAuth.js`
- Utilities: `apiClient.js`
- Constants: `constants.js`

### Smart Contracts
- Contract files: `DigitalID.sol`
- Test files: `DigitalID.test.js`
- Deploy scripts: `deploy-identity.js`

### AI/ML Files
- Model files: `incident_detection_model.py`
- Training scripts: `train_model.py`
- Preprocessing: `preprocess_data.py`
- Evaluation: `evaluate_model.py`

## Import/Export Patterns

### JavaScript/TypeScript
```javascript
// Named exports (preferred)
export const UserService = {
  // implementation
};

// Default exports for main components
export default UserProfile;

// Import patterns
import { UserService } from '../services/userService';
import UserProfile from '../components/UserProfile';
```

### Python
```python
# Module imports
from .models import IncidentDetectionModel
from ..utils import preprocess_data

# External imports
import numpy as np
import tensorflow as tf
```

## Configuration Management

### Environment-based Configuration
- `.env.development` - Development settings
- `.env.staging` - Staging settings
- `.env.production` - Production settings
- `.env.example` - Template file

### Service Configuration
- Each service has its own config directory
- Configuration is loaded based on NODE_ENV
- Sensitive data is stored in environment variables

## Key Architectural Decisions

1. **Microservices Architecture**: Services are loosely coupled and independently deployable
2. **Event-Driven Communication**: Services communicate via events and message queues
3. **Database per Service**: Each service has its own database
4. **API Gateway Pattern**: Single entry point for all client requests
5. **Container-First Approach**: All services are containerized for consistency
6. **CI/CD Pipeline**: Automated testing and deployment
7. **Monitoring and Observability**: Comprehensive logging and metrics collection

This structure supports scalability, maintainability, and team collaboration while ensuring clear separation of concerns across all system components.