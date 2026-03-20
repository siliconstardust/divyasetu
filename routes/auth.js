// routes/auth.js – Registration, Login, Logout
const express  = require('express');
const bcrypt   = require('bcryptjs');
const db       = require('../config/db');
const router   = express.Router();

// ── GET /auth/login ──────────────────────────────────────────
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login', { title: 'Login – DivyaSetu' });
});

// ── POST /auth/login ─────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length) {
            req.flash('error', 'No account found with that email.');
            return res.redirect('/auth/login');
        }
        const user  = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            req.flash('error', 'Incorrect password.');
            return res.redirect('/auth/login');
        }
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        req.flash('success', `Welcome back, ${user.name}!`);
        return user.role === 'admin' ? res.redirect('/admin') : res.redirect('/user/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Server error. Please try again.');
        res.redirect('/auth/login');
    }
});

// ── GET /auth/register ───────────────────────────────────────
router.get('/register', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/register', { title: 'Register – DivyaSetu' });
});

// ── POST /auth/register ──────────────────────────────────────
router.post('/register', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;

    // Frontend + backend validation
    if (!name || !email || !password) {
        req.flash('error', 'All fields are required.');
        return res.redirect('/auth/register');
    }
    if (password !== confirm_password) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('/auth/register');
    }
    if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters.');
        return res.redirect('/auth/register');
    }
    try {
        const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (exists.length) {
            req.flash('error', 'Email is already registered.');
            return res.redirect('/auth/register');
        }
        const hashed = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Server error. Please try again.');
        res.redirect('/auth/register');
    }
});

// ── GET /auth/logout ─────────────────────────────────────────
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
