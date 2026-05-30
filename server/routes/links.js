const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const db = require('../db');
const verifyToken = require('../middleware/authMiddleware');

// =====================
// HELPER FUNCTIONS
// =====================

function addLog(userId, actionType, targetId, description) {
    const sql = `
        INSERT INTO logs (user_id, action_type, target_id, description)
        VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [userId, actionType, targetId, description]);
}

// =====================
// MULTER CONFIGURATION
// =====================

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'client/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// =====================
// ADD LINK
// =====================

router.post('/add', verifyToken, (req, res) => {
    // Authorization check
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({ message: 'Access Denied' });
    }

    const { title, description, url, type, tags, thumbnail_url } = req.body;

    const thumbnail = req.file ? `/uploads/${req.file.filename}` : (thumbnail_url || '');
    const sql = `
        INSERT INTO links (title, description, url, type, thumbnail, tags, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [title, description, url, type, thumbnail, tags, req.user.id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        addLog(req.user.id, 'ADD_LINK', result.insertId, `Added link: ${title}`);
        res.json({ message: 'Link Added' });
    });
});


// =====================
// GET ALL LINKS
// =====================

router.get('/', verifyToken, (req, res) => {
    const sql = `SELECT

links.*,
users.username

FROM links

JOIN users

ON links.created_by = users.id

ORDER BY created_at DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});


// =====================
// SEARCH LINKS
// =====================

router.get('/search/:text', verifyToken, (req, res) => {
    const text = req.params.text;
    const searchValue = `%${text}%`;

    const sql = `
        SELECT

links.*,
users.username

FROM links

JOIN users

ON links.created_by = users.id
        WHERE title LIKE ? OR description LIKE ? OR tags LIKE ? OR type LIKE ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [searchValue, searchValue, searchValue, searchValue], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});


// =====================
// GET STATS (ALL)
// =====================

router.get('/stats/all', verifyToken, (req, res) => {
    const sql = `
        SELECT COUNT(*) as totalLinks, COUNT(DISTINCT type) as totalTypes
        FROM links
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result[0]);
    });
});


// =====================
// GET STATS (BY TYPE)
// =====================

router.get('/stats/types', verifyToken, (req, res) => {
    const sql = `
        SELECT type, COUNT(*) as count
        FROM links
        GROUP BY type
        ORDER BY count DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});


// =====================
// GET SINGLE LINK
// =====================

router.get('/:id', verifyToken, (req, res) => {
const id = req.params.id;
const sql = `
    SELECT
        links.*,
        users.username
    FROM links
    JOIN users ON links.created_by = users.id
    WHERE links.id = ?
`;

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Link Not Found' });
        }
        res.json(result[0]);
    });
});


// =====================
// UPDATE LINK
// =====================

router.put('/:id', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admins Only' });
    }

    const id = req.params.id;
    const { title, description, url, type, tags } = req.body;

    const sql = `
        UPDATE links
        SET title = ?, description = ?, url = ?, type = ?, tags = ?
        WHERE id = ?
    `;

    db.query(sql, [title, description, url, type, tags, id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        addLog(req.user.id, 'UPDATE_LINK', id, `Updated link: ${title}`);
        res.json({ message: 'Link Updated' });
    });
});


// =====================
// DELETE LINK
// =====================

router.delete('/:id', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admins Only' });
    }

    const id = req.params.id;
    const sql = 'DELETE FROM links WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        addLog(req.user.id, 'DELETE_LINK', id, 'Deleted a link');
        res.json({ message: 'Link Deleted' });
    });
});


// =====================
// GET LOGS
// =====================

router.get('/logs/all', verifyToken, (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admins Only' });
    }

    const sql = `
        SELECT logs.*, users.username
        FROM logs
        JOIN users ON logs.user_id = users.id
        ORDER BY logs.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
});

module.exports = router;