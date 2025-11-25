const dbPool = require('../config/db');

/**
 * 아직 스와이프하지 않은 후보 목록을 최신 등록 순으로 조회합니다.
 */
const getCandidates = async (userId, userGender, limit = 10) => {
    const limitInt = Number.isFinite(parseInt(limit, 10)) ? parseInt(limit, 10) : 10;

    const query = `
        SELECT 
            u.id, u.email, u.nickname, u.gender, u.birth_date, u.bio, u.profile_image_url, u.tags
        FROM 
            users u
        WHERE 
            u.id != ?
            AND u.id NOT IN (
                SELECT user_id_target 
                FROM matches 
                WHERE user_id_swiper = ?
            )
        ORDER BY u.created_at DESC
        LIMIT ?
    `;

    const [rows] = await dbPool.execute(query, [userId, userId, limitInt]);
    return rows;
};

/**
 * 스와이프 기록을 저장하고 매칭 여부를 확인합니다.
 */
const recordSwipeAndCheckMatch = async (swiperId, targetId, direction) => {
    // 1. 스와이프 기록 저장
    const insertQuery = `
        INSERT INTO matches (user_id_swiper, user_id_target, swipe_direction)
        VALUES (?, ?, ?)
    `;
    await dbPool.execute(insertQuery, [swiperId, targetId, direction]);

    if (direction === 'nope') {
        return { isMatch: false }; 
    }

    // 2. 매칭 확인: 상대방이 나를 '좋아요' 했는지 확인
    const checkMatchQuery = `
        SELECT 1 
        FROM matches 
        WHERE user_id_swiper = ?
          AND user_id_target = ?
          AND swipe_direction = 'like'
    `;
    const [rows] = await dbPool.execute(checkMatchQuery, [targetId, swiperId]);
    
    const isMatch = rows.length > 0;

    if (isMatch) {
        // 3. 매칭 성사 시, 양쪽의 is_match 필드를 TRUE로 업데이트
        const updateQuery = `
            UPDATE matches
            SET is_match = TRUE
            WHERE (user_id_swiper = ? AND user_id_target = ?) 
               OR (user_id_swiper = ? AND user_id_target = ?)
        `;
        await dbPool.execute(updateQuery, [swiperId, targetId, targetId, swiperId]);
    }

    return { isMatch };
};

/**
 * 현재 사용자 기준 태그 일치 점수를 계산하여 상위 N명을 반환합니다.
 * 점수 = 일치 태그 개수 × 10
 */
const getTopMatchesByTagScore = async (userId, userTags, limit = 3) => {
    const query = `
        SELECT u.id, u.nickname, u.bio, u.profile_image_url, u.tags
        FROM users u
        WHERE u.id != ?
    `;
    const [rows] = await dbPool.execute(query, [userId]);

    const baseTags = (userTags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

    const scored = rows.map(r => {
        const otherTags = (r.tags || '')
            .split(',')
            .map(t => t.trim())
            .filter(Boolean);
        const set = new Set(otherTags);
        let matches = 0;
        for (const t of baseTags) {
            if (set.has(t)) matches += 1;
        }
        return { ...r, match_score: matches * 10 };
    });

    scored.sort((a, b) => b.match_score - a.match_score);
    return scored.slice(0, Number.isFinite(parseInt(limit, 10)) ? parseInt(limit, 10) : 3);
};

module.exports = {
    getCandidates,
    recordSwipeAndCheckMatch,
    getTopMatchesByTagScore,
};
