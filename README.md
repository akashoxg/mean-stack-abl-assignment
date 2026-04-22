# MEAN Stack Task Manager 🚀

A full-stack **MEAN** (MongoDB, Express.js, Angular, Node.js) Task Manager application built as part of the **Activity Based Learning (ABL)** assignment.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 21 |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB Atlas |
| **Deployment** | Microsoft Azure App Service |

## 📁 Project Structure

```
mean-activity/
├── backend/
│   ├── models/Task.js       # Mongoose schema
│   ├── routes/tasks.js       # REST API routes
│   ├── server.js             # Express server
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Angular components
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   ├── services/     # HTTP services
│   │   │   └── ...
│   │   └── environments/     # Dev/Prod configs
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (free tier)

### Backend Setup
```bash
cd backend
npm install
# Update .env with your MongoDB Atlas URI
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run start
```

### Access the App
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api/tasks

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Health check |

## 🌐 Deployment (Azure)

This project is deployed on **Microsoft Azure App Service** with:
- Continuous Deployment via GitHub Actions
- MongoDB Atlas for cloud database
- Environment variables managed via Azure Configuration

## 👤 Author

**ABL Assignment** — MEAN Stack Deployment  
Faculty: Mr. Praveen Kumar  
Date: April 2026
