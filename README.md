# 🔗 Cruising Porto

Mobile app for discovering gay meeting points, check-ins, community interactions, and safety features in the Porto region and beyond.

## 📱 Features

### 🗺️ Map & Location Discovery
- Interactive map with markers for all cruising locations
- Location-based filtering (parks, saunas, shopping centers, public restrooms, etc.)
- "Locations near me" with configurable radius
- Multiple navigation options (car, public transport, walking, cycling)
- Real-time check-in presence counter

### 👥 Check-ins & Presence
- Check-in to mark your presence at a location
- Anonymous check-in option
- See how many people are at each location now
- Get notified when friends/favorite locations get busy
- Privacy controls for location visibility

### 💬 Community & Reviews
- Comment system for each location with timestamps
- Star rating (1-5 scale) and tag-based evaluation
- Alert system for police, robberies, homophobia, construction
- Moderated content with report functionality
- Community-driven safety information

### 🔍 Explore & Discover
- Browse by city/district (Porto, Gaia, Matosinhos, Maia, Gondomar, etc.)
- "Top Locations" ranking by check-ins and ratings
- Popular locations carousel
- Text search by name, neighborhood, location type

### 👤 Profiles & Social
- User profiles with nickname, age, preferences (top/bottom/versatile)
- "People Near Me" radar with GPS distance
- Private messaging between users
- Location suggestions and invitations
- Safety verification system

### 🛡️ Safety & Privacy
- Anonymous mode with time-based visibility control
- Approximate distance display ("within 1km") instead of exact coordinates
- Manual check-in without GPS requirement
- User reports and moderation system
- Privacy-focused data handling
- Safety tips embedded in location context
- Emergency/risk alerts system

### 📚 Educational Content
- "Safe cruising tips and best practices" section
- Context-aware safety reminders
- Location-specific warnings (poor lighting, isolated, etc.)
- Health and consent information

## 🏗️ Project Structure

```
cruising-porto/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # Database models (Sequelize/TypeORM)
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers and utilities
│   │   └── app.js          # Express app setup
│   ├── tests/              # Unit and integration tests
│   ├── migrations/         # Database migrations
│   ├── .env.example        # Environment variables template
│   ├── package.json
│   └── docker-compose.yml  # PostgreSQL, Redis
│
├── mobile/                 # React Native Expo
│   ├── app/
│   │   ├── screens/        # Screen components
│   │   ├── components/     # Reusable components
│   │   ├── navigation/     # Navigation structure
│   │   ├── context/        # Global state (AuthContext, LocationContext)
│   │   ├── hooks/          # Custom hooks (useLocation, useCheckIn)
│   │   ├── services/       # API calls
│   │   ├── utils/          # Helpers
│   │   └── app.json        # Expo configuration
│   ├── assets/             # Images, icons, fonts
│   └── package.json
│
├── web/                    # React web frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Global state
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API integration
│   │   ├── styles/         # CSS/Tailwind
│   │   └── App.js
│   ├── public/             # Static assets
│   └── package.json
│
├── docs/                   # Documentation
│   ├── API.md              # API documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── ARCHITECTURE.md     # System architecture
│   └── DATABASE.md         # Database schema
│
├── docker-compose.yml      # Full stack orchestration
├── .env.example            # Global env variables
└── README.md               # This file
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js / NestJS
- **Database**: PostgreSQL with PostGIS for geospatial queries
- **Cache**: Redis
- **ORM**: Sequelize or TypeORM
- **Auth**: JWT tokens
- **Maps**: Mapbox or Google Maps API
- **Notifications**: Firebase Cloud Messaging / APNs

### Mobile
- **Framework**: React Native / Expo
- **State Management**: Context API / Zustand / Redux
- **Maps**: Mapbox React Native or Google Maps
- **Geolocation**: expo-location
- **Local Storage**: AsyncStorage
- **Push Notifications**: expo-notifications

### Web
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS or Leaflet
- **State Management**: Context API / Zustand
- **API Client**: Axios / Fetch
- **Build Tool**: Vite / Create React App

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker & Docker Compose (optional)
- Expo CLI for mobile development

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run seed  # Optional: seed with sample data
npm run dev   # Start development server
```

### Mobile Setup

```bash
cd mobile
npm install
npm start    # Start Expo dev server
```

### Web Setup

```bash
cd web
npm install
npm run dev  # Start development server
```

### Docker Setup

```bash
docker-compose up -d
```

## 🔑 Environment Variables

Create `.env` in each directory based on `.env.example`:

```env
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/cruising_porto
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
MAP_API_KEY=your_mapbox_key
FIREBASE_KEY=your_firebase_key

# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MAP_KEY=your_mapbox_key
```

## 📚 API Endpoints (Overview)

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Locations
- `GET /api/locations` - List all locations (with filters)
- `GET /api/locations/:id` - Get location details
- `POST /api/locations` - Create location (admin)
- `PUT /api/locations/:id` - Update location (admin)
- `GET /api/locations/near/:lat/:lng` - Get nearby locations

### Check-ins
- `POST /api/checkins` - Create check-in
- `GET /api/checkins/location/:id` - Get recent check-ins for location
- `DELETE /api/checkins/:id` - Delete own check-in

### Comments & Reviews
- `GET /api/locations/:id/comments` - Get comments for location
- `POST /api/locations/:id/comments` - Add comment
- `POST /api/locations/:id/rate` - Rate location

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/nearby` - Get users near me

### Messages
- `GET /api/messages/:userId` - Get conversation
- `POST /api/messages/:userId` - Send message

## 🚀 Deployment

### Production Checklist
- [ ] Database backups configured
- [ ] Environment variables secured
- [ ] SSL/TLS certificates installed
- [ ] API rate limiting enabled
- [ ] CORS policies configured
- [ ] Content moderation system active
- [ ] Error logging setup
- [ ] Analytics configured

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd web
npm run test
```

## 📖 Documentation

Detailed documentation available in `/docs`:
- [API Documentation](docs/API.md)
- [Database Schema](docs/DATABASE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Code of Conduct

This project is dedicated to the LGBTQ+ community. All contributors must:
- Respect diversity and inclusion
- Maintain user safety and privacy
- Follow ethical data practices
- Report any discriminatory behavior

## 🔒 Security & Privacy

- All user data is encrypted in transit (HTTPS/TLS)
- Passwords hashed with bcrypt
- PII handled according to GDPR/LGPD
- Privacy policy available at `/privacy`
- Terms of service at `/terms`
- Moderation for user-generated content
- Report system for harmful content

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: support@cruisingporto.app (when deployed)

## 🙏 Acknowledgments

- Built with ❤️ for the LGBTQ+ community in Porto
- Inspired by existing cruising guide websites and mobile apps
- Community feedback and contributions drive development

## 🗺️ Roadmap

- [ ] v1.0: MVP with core features (map, check-ins, comments)
- [ ] v1.1: User profiles and messaging
- [ ] v1.2: Advanced filtering and recommendations
- [ ] v1.3: Events and group meetups
- [ ] v1.4: Integration with other LGBTQ+ apps
- [ ] v2.0: Expansion to other cities/countries

---

**Last Updated**: February 2026
**Status**: Development (MVP Phase)

Join us in building a safer, more connected community! 🏳️‍🌈
