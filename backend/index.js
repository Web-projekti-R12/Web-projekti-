import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './config/db.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import groupMovieRoutes from './routes/groupMovieRoutes.js';

const app = express();

// Middlewaret
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API-reitit
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api', groupMovieRoutes);

// Testireitti
app.get('/test', (req, res) => {
  res.send('Palvelin vastaa ja reititys toimii!');
});

// Käynnistys
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend toimii portissa ${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  });
}

// Export supertestiä varten
export default app;
