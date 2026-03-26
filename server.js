// server.js – DivyaSetu Express Application Entry Point
require('dotenv').config();
const express        = require('express');
const session        = require('express-session');
const flash          = require('connect-flash');
const methodOverride = require('method-override');
const path           = require('path');
const db             = require('./config/db');
const { setLocals }  = require('./middleware/auth');

const app  = express();
const PORT = process.env.PORT || 8080;

// ── View engine ───────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Static files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Body parsers ──────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ── Method override (for PUT/DELETE via forms) ────────────────
app.use(methodOverride('_method'));

// ── Session ───────────────────────────────────────────────────
app.use(session({
    secret:            process.env.SESSION_SECRET || 'divyasetu_secret',
    resave:            false,
    saveUninitialized: false,
    cookie:            { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// ── Flash messages ────────────────────────────────────────────
app.use(flash());

// ── Global locals (user, flash) ───────────────────────────────
app.use(setLocals);

// ── Routes ────────────────────────────────────────────────────
app.use('/auth',     require('./routes/auth'));
app.use('/temples',  require('./routes/temples'));
app.use('/bookings', require('./routes/bookings'));
app.use('/user',     require('./routes/user'));
app.use('/admin',    require('./routes/admin'));

// ── Home page ─────────────────────────────────────────────────
app.get('/', async (req, res) => {
    try {
        const [featuredTemples] = await db.query(
            'SELECT * FROM temples WHERE is_active = 1 ORDER BY RAND() LIMIT 3'
        );
        res.render('home', { title: 'DivyaSetu – Online Temple Booking', featuredTemples });
    } catch (err) {
        console.error(err);
        res.render('home', { title: 'DivyaSetu – Online Temple Booking', featuredTemples: [] });
    }
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('404', { title: '404 – Page Not Found' });
});

// ── Start server ──────────────────────────────────────────────

app.listen(PORT, () => {
    const baseURL = process.env.RAILWAY_STATIC_URL || `http://localhost:${PORT}`;

    console.log(`\n🕉️ DivyaSetu is running at ${baseURL}`);
    console.log(`   Admin: ${baseURL}/auth/login`);
    console.log(`   Press Ctrl+C to stop\n`);
});
