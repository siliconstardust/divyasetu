// routes/admin.js – Full admin panel
const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const db       = require('../config/db');
const { isAdmin } = require('../middleware/auth');
const router   = express.Router();

// ── Multer image upload setup ─────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/images/temples/'),
    filename:    (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, 'temple_' + Date.now() + ext);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp/;
        cb(null, allowed.test(file.mimetype));
    }
});

// ── GET /admin ────────────────────────────────────────────────
router.get('/', isAdmin, async (req, res) => {
    try {
        const [[{ totalUsers }]]    = await db.query('SELECT COUNT(*) AS totalUsers FROM users WHERE role = "user"');
        const [[{ totalTemples }]]  = await db.query('SELECT COUNT(*) AS totalTemples FROM temples');
        const [[{ totalBookings }]] = await db.query('SELECT COUNT(*) AS totalBookings FROM bookings');
        const [[{ todayBookings }]] = await db.query(
            'SELECT COUNT(*) AS todayBookings FROM bookings WHERE booking_date = CURDATE()'
        );
        const [recentBookings] = await db.query(
            `SELECT b.*, u.name AS user_name, t.name AS temple_name
             FROM bookings b JOIN users u ON b.user_id = u.id JOIN temples t ON b.temple_id = t.id
             ORDER BY b.created_at DESC LIMIT 8`
        );
        res.render('admin/dashboard', {
            title: 'Admin Dashboard – DivyaSetu',
            stats: { totalUsers, totalTemples, totalBookings, todayBookings },
            recentBookings
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// ── Temples CRUD ──────────────────────────────────────────────
router.get('/temples', isAdmin, async (req, res) => {
    const [temples] = await db.query('SELECT * FROM temples ORDER BY created_at DESC');
    res.render('admin/temples', { title: 'Manage Temples', temples });
});

router.get('/temples/new', isAdmin, (req, res) => {
    res.render('admin/temple-form', { title: 'Add Temple', temple: null });
});

router.post('/temples', isAdmin, upload.single('image'), async (req, res) => {
    const { name, location, description, deity, capacity, image_url } = req.body;
    const imgUrl = req.file ? `/images/temples/${req.file.filename}` : image_url;
    try {
        await db.query(
            'INSERT INTO temples (name, location, description, deity, capacity, image_url) VALUES (?,?,?,?,?,?)',
            [name, location, description, deity, capacity || 50, imgUrl]
        );
        req.flash('success', 'Temple added successfully!');
        res.redirect('/admin/temples');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to add temple.');
        res.redirect('/admin/temples/new');
    }
});

router.get('/temples/:id/edit', isAdmin, async (req, res) => {
    const [rows] = await db.query('SELECT * FROM temples WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.redirect('/admin/temples');
    res.render('admin/temple-form', { title: 'Edit Temple', temple: rows[0] });
});

router.post('/temples/:id', isAdmin, upload.single('image'), async (req, res) => {
    const { name, location, description, deity, capacity, image_url, is_active } = req.body;
    const imgUrl = req.file ? `/images/temples/${req.file.filename}` : image_url;
    try {
        await db.query(
            'UPDATE temples SET name=?, location=?, description=?, deity=?, capacity=?, image_url=?, is_active=? WHERE id=?',
            [name, location, description, deity, capacity, imgUrl, is_active === 'on' ? 1 : 0, req.params.id]
        );
        req.flash('success', 'Temple updated!');
        res.redirect('/admin/temples');
    } catch (err) {
        req.flash('error', 'Update failed.');
        res.redirect('/admin/temples');
    }
});

router.post('/temples/:id/delete', isAdmin, async (req, res) => {
    await db.query('DELETE FROM temples WHERE id = ?', [req.params.id]);
    req.flash('success', 'Temple deleted.');
    res.redirect('/admin/temples');
});

// ── Bookings management ───────────────────────────────────────
router.get('/bookings', isAdmin, async (req, res) => {
    const [bookings] = await db.query(
        `SELECT b.*, u.name AS user_name, u.email, t.name AS temple_name
         FROM bookings b JOIN users u ON b.user_id = u.id JOIN temples t ON b.temple_id = t.id
         ORDER BY b.created_at DESC`
    );
    res.render('admin/bookings', { title: 'Manage Bookings', bookings });
});

router.post('/bookings/:id/status', isAdmin, async (req, res) => {
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    req.flash('success', 'Booking status updated.');
    res.redirect('/admin/bookings');
});

// ── Users list ────────────────────────────────────────────────
router.get('/users', isAdmin, async (req, res) => {
    const [users] = await db.query(
        `SELECT u.*, COUNT(b.id) AS booking_count
         FROM users u LEFT JOIN bookings b ON u.id = b.user_id
         GROUP BY u.id ORDER BY u.created_at DESC`
    );
    res.render('admin/users', { title: 'Manage Users', users });
});

module.exports = router;
