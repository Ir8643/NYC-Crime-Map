# 🗽 NYC Real Data Dashboard

A real-time visualization dashboard for NYC Open Data, featuring incident playback, interactive maps, and data analytics. Built with React, TypeScript, and modern web technologies.

![NYC Dashboard](https://img.shields.io/badge/NYC-Open%20Data-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)

## ✨ Features

- 🗺️ **Interactive Map Visualization** - Real-time incident mapping with Leaflet
- 📊 **Data Analytics** - Category and hourly distribution charts
- ▶️ **Playback Controls** - Visualize incidents with 200ms delay playback
- 📱 **Live Feed** - Real-time incident feed with color-coded markers
- 🎨 **Modern UI** - Beautiful dark theme with Tailwind CSS
- 🛡️ **Error Handling** - Comprehensive error boundaries and graceful fallbacks
- 🔄 **Real-time Data** - Fetches latest 50 records from NYC Open Data APIs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd NYC-Crime-Map
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

This will start:

- **Backend** on `http://localhost:3001`
- **Frontend** on `http://localhost:5173`

## 📁 Project Structure

```
nyc-dashboard/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Data fetching services
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── vite.config.ts
└── package.json            # Root package
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Leaflet** - Map visualization
- **Chart.js** - Data visualization

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety

## 📡 API Endpoints

The dashboard fetches data from NYC Open Data:

- **311 Service Requests**: `https://data.cityofnewyork.us/resource/erm2-nwe9.json`
- **NYPD Complaint Data**: `https://data.cityofnewyork.us/resource/5uac-w243.json`

### Backend API

- `GET /api/incidents` - Fetch all normalized incidents
- `GET /api/health-check` - Test API connectivity
- `GET /health` - Server health check

## 🎮 Usage

1. **Load Data**: The dashboard automatically fetches data on load
2. **Play**: Click "Play" to start visualizing incidents appearing on the map
3. **Pause**: Click "Pause" to stop playback
4. **Reset**: Click "Reset" to clear and start over

### Color Coding

- 🔴 **Red markers** = NYPD Complaints
- 🔵 **Blue markers** = 311 Service Requests

## 🌐 Deployment

### Cloudflare Pages

This project is configured for deployment on Cloudflare Pages.

#### Automatic Deployment

1. **Connect your repository** to Cloudflare Pages
2. **Configure build settings**:
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Build output directory**: `frontend/dist`
   - **Root directory**: `/` (root of repo)

#### Environment Variables

Set these in Cloudflare Pages dashboard:

- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.workers.dev/api`)

#### Manual Deployment

```bash
# Build the frontend
cd frontend
npm install
npm run build

# The dist/ folder contains the production build
```

### Backend Deployment

The backend can be deployed separately:

#### Option 1: Cloudflare Workers

Convert the Express app to Cloudflare Workers format

#### Option 2: Traditional Hosting

Deploy to services like:

- Railway
- Render
- Heroku
- DigitalOcean App Platform

#### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
FRONTEND_URL=https://your-frontend.pages.dev
```

## 🧪 Development

### Running Tests

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

## 📝 Scripts

### Root Level

- `npm run dev` - Start both frontend and backend
- `npm run install:all` - Install all dependencies

### Frontend

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm run dev` - Start dev server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

## 🐛 Troubleshooting

### API Connection Issues

If you see connection errors:

1. **Check internet connection**
2. **Verify backend is running** on port 3001
3. **Test DNS resolution**: `nslookup data.cityofnewyork.us`
4. **Check browser console** for detailed error messages

### White Screen

If the app shows a white screen:

1. **Check browser console** for JavaScript errors
2. **Verify all dependencies are installed**
3. **Clear browser cache** and reload
4. **Check error boundary** for React errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [NYC Open Data](https://opendata.cityofnewyork.us/) for providing the APIs
- [Leaflet](https://leafletjs.com/) for map visualization
- [Chart.js](https://www.chartjs.org/) for data visualization

## 📧 Contact

For questions or issues, please open an issue on GitHub.

---

Made with ❤️ for NYC
