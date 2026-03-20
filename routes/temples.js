// routes/temples.js – Public temple listing and detail
const express = require('express');
const db      = require('../config/db');
const router  = express.Router();

// ── GET /temples ─────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        let query  = 'SELECT * FROM temples WHERE is_active = 1';
        let params = [];
        if (search) {
            query  += ' AND (name LIKE ? OR location LIKE ? OR deity LIKE ?)';
            params  = [`%${search}%`, `%${search}%`, `%${search}%`];
        }
        query += ' ORDER BY name ASC';
        const [temples] = await db.query(query, params);
        res.render('temples/index', { title: 'Temples – DivyaSetu', temples, search });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load temples.');
        res.redirect('/');
    }
});

// ── GET /temples/:id ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM temples WHERE id = ? AND is_active = 1', [req.params.id]);
        if (!rows.length) {
            req.flash('error', 'Temple not found.');
            return res.redirect('/temples');
        }
        res.render('temples/detail', { title: rows[0].name + ' – DivyaSetu', temple: rows[0] });
    } catch (err) {
        console.error(err);
        res.redirect('/temples');
    }
});

module.exports = router;
