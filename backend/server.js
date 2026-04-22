/**
 * MEAN Stack Task Manager — Express.js Server
 * Main entry point for the Node.js backend.
 * Uses MongoDB Memory Server for local development/demo.
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const taskRoutes = require('./routes/tasks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── API Routes ─────────────────────────────────────────────
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ─── Serve Angular build in production ──────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// ─── MongoDB Connection ─────────────────────────────────────
async function startServer() {
  let mongoUri = process.env.MONGODB_URI;

  // Use MongoDB Memory Server for local development if no real URI
  if (!mongoUri || mongoUri.includes('meanuser:meanpassword123')) {
    console.log('📦 No production MongoDB URI found. Starting MongoDB Memory Server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    console.log(`📦 Memory MongoDB running at: ${mongoUri}`);
  }

  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB successfully');

  // Seed some sample tasks for demo
  const Task = require('./models/Task');
  const count = await Task.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding sample tasks...');
    await Task.insertMany([
      {
        title: 'Set up MEAN Stack Project',
        description: 'Initialize MongoDB, Express.js, Angular, and Node.js project structure',
        status: 'completed',
        priority: 'high'
      },
      {
        title: 'Create REST API with Express',
        description: 'Build CRUD endpoints for task management',
        status: 'completed',
        priority: 'high'
      },
      {
        title: 'Build Angular Frontend',
        description: 'Create UI components for task list, form, and filters',
        status: 'completed',
        priority: 'high'
      },
      {
        title: 'Connect to MongoDB Atlas',
        description: 'Set up cloud database and configure connection string',
        status: 'in-progress',
        priority: 'medium'
      },
      {
        title: 'Deploy to Microsoft Azure',
        description: 'Deploy the MEAN stack app to Azure App Service',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2026-04-22')
      },
      {
        title: 'Set up CI/CD Pipeline',
        description: 'Configure GitHub Actions for continuous deployment',
        status: 'pending',
        priority: 'medium'
      },
      {
        title: 'Write Project Documentation',
        description: 'Create README and deployment guide for ABL submission',
        status: 'in-progress',
        priority: 'low'
      }
    ]);
    console.log('🌱 Sample tasks seeded!');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 ═══════════════════════════════════════════`);
    console.log(`   MEAN Stack Task Manager`);
    console.log(`   Server:  http://localhost:${PORT}`);
    console.log(`   Health:  http://localhost:${PORT}/api/health`);
    console.log(`   API:     http://localhost:${PORT}/api/tasks`);
    console.log(`═══════════════════════════════════════════════\n`);
  });
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\n🛑 Server shut down gracefully');
  process.exit(0);
});
