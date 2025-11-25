const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const dbPool = require('./src/config/db');

const app = express();

// 🔥 CORS 설정 (Netlify + localhost 허용)
const allowedOrigins = [
  'http://localhost:3000',
  'https://spiffy-kulfi-9704de.netlify.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

app.use(express.json());

// 라우터 등록
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const postRoutes = require('./src/routes/postRoutes');
const majorRoutes = require('./src/routes/majorRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/majors', majorRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
