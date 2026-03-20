// routes/user.js – User dashboard
const express = require('express');
const db      = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');
const router  = express.Router();

// ── GET /user/dashboard ───────────────────────────────────────
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.user.id;
        const today  = new Date().toISOString().split('T')[0];

        const [upcomingBookings] = await db.query(
            `SELECT b.*, t.name AS temple_name, t.location, t.image_url
             FROM bookings b JOIN temples t ON b.temple_id = t.id
             WHERE b.user_id = ? AND b.booking_date >= ? AND b.status != 'cancelled'
             ORDER BY b.booking_date ASC, b.time_slot ASC`,
            [userId, today]
        );
        const [pastBookings] = await db.query(
            `SELECT b.*, t.name AS temple_name, t.location, t.image_url
             FROM bookings b JOIN temples t ON b.temple_id = t.id
             WHERE b.user_id = ? AND (b.booking_date < ? OR b.status = 'cancelled')
             ORDER BY b.booking_date DESC LIMIT 10`,
            [userId, today]
        );
        res.render('user/dashboard', {
            title: 'My Dashboard – DivyaSetu',
            upcomingBookings,
            pastBookings
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not load dashboard.');
        res.redirect('/');
    }
});

module.exports = router;
