// routes/bookings.js – Create & view bookings
const express = require('express');
const db      = require('../config/db');
const { isAuthenticated } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const router  = express.Router();

const TIME_SLOTS = [
    '05:00 AM - 06:00 AM',
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
];

// ── GET /bookings/new?temple_id= ──────────────────────────────
router.get('/new', isAuthenticated, async (req, res) => {
    try {
        const [temples] = await db.query('SELECT id, name, location FROM temples WHERE is_active = 1 ORDER BY name');
        const selectedId = req.query.temple_id || '';
        res.render('bookings/new', {
            title: 'Book a Visit – DivyaSetu',
            temples,
            selectedId,
            timeSlots: TIME_SLOTS
        });
    } catch (err) {
        console.error(err);
        res.redirect('/temples');
    }
});

// ── POST /bookings ────────────────────────────────────────────
router.post('/', isAuthenticated, async (req, res) => {
    const { temple_id, booking_date, time_slot, persons } = req.body;
    const userId = req.session.user.id;

    // Validation
    if (!temple_id || !booking_date || !time_slot || !persons) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/bookings/new');
    }
    const dateObj = new Date(booking_date);
    const today   = new Date(); today.setHours(0,0,0,0);
    if (dateObj < today) {
        req.flash('error', 'Please select a future date.');
        return res.redirect('/bookings/new');
    }
    if (parseInt(persons) < 1 || parseInt(persons) > 20) {
        req.flash('error', 'Persons must be between 1 and 20.');
        return res.redirect('/bookings/new');
    }

    try {
        // Check slot availability (max capacity check)
        const [temple] = await db.query('SELECT capacity FROM temples WHERE id = ?', [temple_id]);
        if (!temple.length) {
            req.flash('error', 'Temple not found.');
            return res.redirect('/bookings/new');
        }
        const [booked] = await db.query(
            'SELECT SUM(persons) AS total FROM bookings WHERE temple_id = ? AND booking_date = ? AND time_slot = ? AND status != "cancelled"',
            [temple_id, booking_date, time_slot]
        );
        const totalBooked = booked[0].total || 0;
        if (totalBooked + parseInt(persons) > temple[0].capacity) {
            req.flash('error', `This slot is full. Only ${temple[0].capacity - totalBooked} spots remain.`);
            return res.redirect('/bookings/new');
        }

        // Generate unique booking ref
        const ref = 'DS-' + Date.now().toString().slice(-6) + '-' + Math.random().toString(36).slice(2,5).toUpperCase();
        await db.query(
            'INSERT INTO bookings (user_id, temple_id, booking_date, time_slot, persons, status, booking_ref) VALUES (?, ?, ?, ?, ?, "confirmed", ?)',
            [userId, temple_id, booking_date, time_slot, persons, ref]
        );

        const [newBook] = await db.query(
            `SELECT b.*, t.name AS temple_name, t.location, t.image_url
             FROM bookings b JOIN temples t ON b.temple_id = t.id
             WHERE b.booking_ref = ?`, [ref]
        );
        res.render('bookings/confirmation', {
            title: 'Booking Confirmed – DivyaSetu',
            booking: newBook[0]
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Booking failed. Please try again.');
        res.redirect('/bookings/new');
    }
});

// ── POST /bookings/:id/cancel ─────────────────────────────────
router.post('/:id/cancel', isAuthenticated, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM bookings WHERE id = ? AND user_id = ?',
            [req.params.id, req.session.user.id]
        );
        if (!rows.length) {
            req.flash('error', 'Booking not found.');
            return res.redirect('/user/dashboard');
        }
        await db.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [req.params.id]);
        req.flash('success', 'Booking cancelled successfully.');
        res.redirect('/user/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/user/dashboard');
    }
});

module.exports = router;
