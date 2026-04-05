# Real-Time Operations & Analytics Engine 🚀

A production-ready telemetry and analytics engine designed to ingest events, perform real-time mathematical aggregation, and securely stream live statistics to a rich Glassmorphism dashboard over WebSockets. Built natively on the MERN stack with complete Docker containerization.

## 🌟 Key Features
- **High-Speed Ingestion Pipeline:** Natively handles telemetry payloads (`POST /api/events`), validating and mapping them directly to a `Mongoose` schema.
- **Bi-Directional Streaming:** Utilizes `Socket.IO` to stream aggregated statistical payloads (Active Users, Events/sec, Fault Rates) to connected users exactly every `1000ms`.
- **JWT Cryptographic Security:** Both the Express Gateway and Dashboard Actions are securely locked behind cryptographic `jsonwebtoken` verification and `bcrypt` hashing.
- **Live Waveform Analytics:** A stunning front-end equipped with `Chart.js` rendering real-time waveforms simulating server traffic dynamics.
- **Dynamic Webhook SOS:** System detects DDoS conditions (`Error Rate > 10%`) and instantly dispatches webhook JSON payloads intended for automated Slack/Discord notification architecture.
- **Docker Orchestrated:** Deploy instantly via `docker-compose.yml`, leveraging lightweight Alpine images and secure multi-stage Nginx compilation.
- **Dynamic Theming:** Seamless real-time variable injection to switch the User Interface globally between Midnight Dark and Studio Light modes.

## 🛠️ Technology Stack
- **Backend:** Node.js, Express.js, Socket.IO 
- **Database:** MongoDB Local / Atlas, Mongoose
- **Frontend:** Vite, React.js, Chart.js, Lucide-React
- **Security:** JSON Web Tokens (JWT), Bcrypt, Helmet, CORS
- **Deployments:** Docker, Docker Compose, Nginx Alpine

## 🏗️ Technical Flowchart

```text
Client Application -> POST /api/events -> Express Router -> MongoDB (Storage)
                                                  |
                                                  v
                                          AnalyticsService (In-Memory Tally)
                                                  |
                                          (Every 1000ms Flush)
                                                  v
Socket.IO Room (`dashboard`) <--- Real-Time Metrics & DDoS Alerts ---> React Application
```

## 🚀 Quick Start (Local Node Instances)

### 1. Initialize the Secure Backend
```bash
cd backend
npm install
node --watch src/server.js
```

### 2. Initialize the Dashboard UI
```bash
cd frontend
npm install
npm run dev
```

## 🐳 Production Deployment (Docker Cloud Environment)
Shut down any running Node terminals and allow Docker to orchestrate the isolated microservice network natively.
```bash
docker-compose up --build -d
```
The application spins up autonomously and securely exposes the front-end interface at `http://localhost:3000`.

## 🧪 Running the Load Simulator
1. Create a secure Admin Profile using the main landing page portal.
2. The Dashboard will authorize the cryptographic keys and establish Live WebSocket sync.
3. Use the integrated `Authorized CLI Simulator` buttons on the dashboard to safely inject standard packet traffic or simulate massive Server Load Spikes to trigger the webhook alerting protocols!

---
*Developed as a premier demonstration of modern Real-Time distributed systems.*
