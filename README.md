# CampusRide

A real-time ride-sharing platform built for college students. Riders post trip requests, drivers compete with offers, and everyone saves money. Built with React, Django, and WebSockets for instant matching.

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.0-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-Channels-yellow)

## Overview

CampusRide connects student riders with student drivers for affordable, campus-area transportation. Unlike traditional ride-sharing apps, drivers compete on price so riders always get the cheapest option.

### How It Works

1. **Rider posts a trip** — Enter pickup and dropoff locations. The app calculates distance and suggests a fair price.
2. **Drivers send offers** — Available drivers see the request in real-time and submit competing price offers.
3. **Rider picks the best deal** — Offers are sorted by price. Accept one, and the ride is confirmed instantly.

### Key Features

- **Real-time matching** — WebSocket-powered live updates for ride requests, offers, and confirmations
- **Competitive pricing** — Drivers bid on rides; riders always see the cheapest offer first
- **Interactive maps** — Leaflet-based route visualization with pickup/dropoff markers
- **Role-based dashboards** — Separate experiences for riders, drivers, and admins
- **Time-based greetings** — Personalized Good Morning/Afternoon/Evening messages
- **Ride history tracking** — Rides are automatically logged when accepted so drivers can revisit who they helped
- **Flexible scheduling** — Request rides immediately, at a specific time, or within a time range
- **Admin panel** — Monitor users, rides, and platform statistics

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 5 | Build tool and dev server |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion | Animations and page transitions |
| React Router 7 | Client-side routing |
| React Leaflet | Interactive map views |
| Axios | HTTP client |
| WebSocket | Real-time communication |

### Backend

| Technology | Purpose |
|---|---|
| Django 5 | Web framework |
| Django REST Framework | REST API |
| Django Channels | WebSocket support |
| Daphne | ASGI server |
| SimpleJWT | Token-based authentication |
| PostgreSQL | Database |
| WhiteNoise | Static file serving |

## Project Structure

```
CampusRide/
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── api/                  # API client modules
│   │   │   ├── authApi.js
│   │   │   ├── ridesApi.js
│   │   │   ├── locationsApi.js
│   │   │   └── adminApi.js
│   │   ├── components/
│   │   │   ├── admin/            # Admin components
│   │   │   ├── auth/             # Login/Register forms
│   │   │   ├── common/           # Shared UI components
│   │   │   │   ├── Illustrations.jsx
│   │   │   │   ├── MapView.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ...
│   │   │   ├── driver/           # Driver-specific components
│   │   │   └── rider/            # Rider-specific components
│   │   ├── context/              # React context (auth)
│   │   ├── hooks/                # Custom hooks (WebSocket, autocomplete)
│   │   ├── pages/
│   │   │   ├── admin/            # Admin dashboard & management
│   │   │   ├── driver/           # Driver dashboard, requests, history
│   │   │   ├── rider/            # Rider dashboard, request ride, offers, history
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── styles/               # Animation presets
│   │   ├── utils/                # Formatters and constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── accounts/                 # User auth, profiles, permissions
    ├── rides/                    # Core ride logic (requests, offers, history)
    ├── locations/                # City data and autocomplete
    ├── notifications/            # WebSocket consumers
    ├── ride_project/             # Django project settings
    ├── manage.py
    └── requirements.txt
```

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL (or SQLite for local dev)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and secret key

# Run migrations
python manage.py migrate

# Load US cities data
python manage.py load_us_cities

# Start the server
daphne -b 0.0.0.0 -p 8000 ride_project.asgi:application
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional — defaults work for local dev)
cp .env.example .env

# Start dev server
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API/WebSocket requests to `http://localhost:8000`.

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register a new user |
| POST | `/api/auth/login/` | Login and receive JWT tokens |
| POST | `/api/auth/logout/` | Logout and blacklist token |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PUT | `/api/auth/profile/` | View or update user profile |
| GET/PUT | `/api/auth/driver-profile/` | View or update driver profile |

### Rides

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rides/request/` | Create a ride request |
| GET | `/api/rides/requests/` | List ride requests (filtered by role) |
| GET | `/api/rides/request/:id/` | Get ride request details |
| PATCH | `/api/rides/request/:id/update/` | Cancel a ride request |
| POST | `/api/rides/offer/` | Submit a ride offer (driver) |
| GET | `/api/rides/offers/?ride_request=:id` | List offers for a request |
| POST | `/api/rides/accept-offer/` | Accept a driver's offer |
| POST | `/api/rides/complete/:id/` | Mark a ride as completed |
| GET | `/api/rides/history/` | Get ride history |
| GET | `/api/rides/active/` | Get current active ride |

### Locations

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/locations/search/?q=:query` | Search US cities by name |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats/` | Platform statistics |
| GET | `/api/admin/users/` | List all users |
| POST | `/api/admin/users/create/` | Create a new user |
| DELETE | `/api/admin/users/:id/` | Delete a user |
| GET | `/api/admin/online-users/` | List currently online users |
| GET | `/api/admin/rides/` | List all rides |

### WebSocket Channels

| Channel | Purpose |
|---|---|
| `/ws/rides/driver/` | Receive new ride requests (drivers) |
| `/ws/rides/rider/:requestId/` | Receive offers and confirmations (riders) |

## User Roles

| Role | Capabilities |
|---|---|
| **Rider** | Request rides, view offers, accept offers, view ride history |
| **Driver** | Toggle availability, view incoming requests, submit price offers, complete rides, view history of people helped |
| **Admin** | Monitor all rides, manage users, view platform stats, create/remove accounts |

## Deployment

### Backend (Railway)

The backend is configured for Railway deployment with `Procfile`, `runtime.txt`, and `dj-database-url` for database configuration.

### Frontend (Vercel)

The frontend includes a `vercel.json` for Vercel deployment with SPA routing support.

### Environment Variables

**Backend** (`.env`):
```
SECRET_KEY=<your-secret-key>
DEBUG=False
ALLOWED_HOSTS=<your-backend-domain>
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
CORS_ALLOWED_ORIGINS=https://<your-frontend-domain>
CSRF_TRUSTED_ORIGINS=https://<your-frontend-domain>,https://<your-backend-domain>
```

**Frontend** (`.env`):
```
VITE_API_URL=https://<your-backend-domain>/api
VITE_WS_URL=wss://<your-backend-domain>
```

## License

This project is for educational purposes.
