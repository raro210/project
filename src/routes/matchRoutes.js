// src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth'); 
const matchController = require('../controllers/matchController');

// GET /api/matches/candidates - 매칭 후보 목록 조회
router.get('/candidates', authenticateToken, matchController.getCandidates);
router.get('/top3', authenticateToken, matchController.getTop3);
router.post('/score', authenticateToken, matchController.scoreByTags);

// POST /api/matches/swipe - 스와이프 처리
router.post('/swipe', authenticateToken, matchController.swipe);

module.exports = router;
