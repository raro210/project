const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const dbPool = require('./src/config/db'); // DB 연결 코드

const app = express();

// CORS 설정 (프론트 도메인 생기면 여기에 넣기)
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*', // 나중에 Netlify 주소 넣으면 더 안전함
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

app.use(express.json());

// 라우터 모듈 가져오기
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const postRoutes = require('./src/routes/postRoutes');
const majorRoutes = require('./src/routes/majorRoutes');

// API 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/majors', majorRoutes);

// ❌ 여기에는 절대 React build 경로 넣지 않음!

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
