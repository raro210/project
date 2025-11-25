const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');

const dbPool = require('./src/config/db'); // DB 연결 코드

const app = express();

// CORS 설정
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*', // Netlify 주소 넣을 예정
    credentials: true,
  })
);

const PORT = process.env.PORT || 3000;

app.use(express.json());

// 라우터 불러오기
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const matchRoutes = require('./src/routes/matchRoutes');
const postRoutes = require('./src/routes/postRoutes');
const majorRoutes = require('./src/routes/majorRoutes');

// 라우팅 등록
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/majors', majorRoutes);

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
